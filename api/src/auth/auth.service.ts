import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import * as jwt from "jsonwebtoken";
import {
  ChangePassDTO,
  ResetPassDTO,
  SignedInDTO,
  SigninDTO,
  SessionDTO,
} from "./dto";
import { SESSION_EXPIRATION, Role, AuthStatus } from "./constants";
import { AuthModel } from "./auth.model";
import { IAuth, IToken } from "./interface";
import { MongooseUtil } from "../util";
import { AuthSanitizer } from "./auth.sanitizer";

@Injectable()
export class AuthService {
  constructor(private readonly sanitizer: AuthSanitizer) {
    this.mongooseUtil = new MongooseUtil();
    this.model = AuthModel;
  }
  //The Model
  private model: Model<IAuth>;
  mongooseUtil: MongooseUtil;

  /************************** Service API *************************/
  /** Signup a new user with the username and password */
  async create(id: string, email: string, password: string, role: Role): Promise<SignedInDTO> {
    try {
      let auth: IAuth = new this.model({
        _id: id,
        user: id,
        email,
        password: password,
        role: role,
        sessions: [],
        status: AuthStatus.ACTIVE,
      });
      const loggedInDTO = await this.login(auth);
      auth.sessions.push(loggedInDTO.token);
      auth = await auth.save();
      return loggedInDTO;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "User with this email exists");
      throw err;
    }
  }

  /** only for testing */
  async createAdmin(
    id: string,
    password: string,
    role: Role
  ): Promise<SignedInDTO> {
    try {
      let auth: IAuth = new this.model({
        _id: id,
        userId: id,
        password: password,
        role: role,
        sessions: [],
        status: AuthStatus.ACTIVE,
      });
      const loggedInDTO = await this.login(auth);
      auth.sessions.push(loggedInDTO.token);
      auth = await auth.save();
      return loggedInDTO;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "User with this email exists");
      throw err;
    }
  }

  /** Singn in a new user with username and password */
  async signin(dto: SigninDTO): Promise<SignedInDTO> {
    const auth: IAuth = await this.model.findOne({ email: dto.email });
    this.checkAuth(auth);
    this.checkStatus(auth.status);
    const isPasswordCorrect = await auth.comparePassword(dto.password);
    this.checkPassword(isPasswordCorrect);
    const loggedInDTO = await this.login(auth);
    auth.sessions.push(loggedInDTO.token);
    await auth.save();
    return loggedInDTO;
  }

  /** Removes the user token from the auth, clearing the user session */
  async logout(id: string, token: string): Promise<string> {
    const auth = await this.model.findOneAndUpdate(
      { _id: id },
      { $pull: { sessions: token } }
    );
    this.checkAuth(auth);
    return auth.sessions.find((e) => e === token);
  }

  /** Changing the user password **/
  async changePassword(dto: ChangePassDTO): Promise<SignedInDTO> {
    const auth = await this.model.findOne({
      _id: dto.user.id,
    });
    this.confirmPassword(dto.newPassword, dto.confirmation);
    if (auth.password) {
      const isPasswordCorrect = await auth.comparePassword(dto.password);
      this.checkPassword(isPasswordCorrect);
      this.confirmPassword(dto.newPassword, dto.confirmation);
    }
    auth.password = dto.newPassword;
    const loggedInDTO = await this.login(auth);
    auth.sessions.push(loggedInDTO.token);
    await auth.save();
    return loggedInDTO;
  }

  /** Forgot password. sends a link with a token to the users email to reset password*/
  async forgotPassword(email: string) {
    const auth = await this.model.findOne({ email });
    this.checkAuth(auth);
    this.checkStatus(auth.status);
    const minutesToExpire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes to expire
    const expString = minutesToExpire.toString();
    const token = await this.generateToken(
      auth,
      process.env.JWT_SECRET_FORGET_PASS,
      expString
    );
    // await this.mailerService.sendMail({
    //   email,
    //   resetToken: token,
    //   type: NotificationType.FORGOT_PASSWORD,
    // });
  }

  /** Resets users password */
  async resetPassword(resetPassDTO: ResetPassDTO): Promise<SignedInDTO> {
    const auth = await this.model.findOne({ email: resetPassDTO.email });
    this.checkAuth(auth);
    auth.password = resetPassDTO.newPassword;
    const loggedInDTO = await this.login(auth);
    auth.sessions.push(loggedInDTO.token);
    await auth.save();
    return loggedInDTO;
  }

  /** find the user with the id */
  async getRaw(id: string): Promise<IAuth> {
    const auth = await this.model.findById(id);
    this.checkAuth(auth);
    return auth;
  }

  /** delete auth object */
  async delete(id: string): Promise<string> {
    const updated = await this.model.findOneAndUpdate(
      { _id: id },
      { $set: { status: AuthStatus.INACTIVE } },
      { new: true }
    );
    if (updated.status === AuthStatus.INACTIVE) {
      return updated.id;
    } else {
      throw new HttpException(
        "Could not close the org, please contact an admin",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /** changes the email  */
  async changeEmail(id: string, email: string): Promise<string> {
    const auth = await this.model.findOneAndUpdate(
      { _id: id },
      { $set: { email: email } },
      { new: true }
    );
    return auth.email;
  }

  /** Verify session */
  async getSession(authId: string, token: string): Promise<IAuth> {
    const auth = await this.model
      .findById(authId)
      .populate("user")
      .populate("permissions");
    this.checkAuth(auth);
    // this.checkActive(auth);
    if (!auth.sessions.includes(token)) {
      throw new HttpException(
        "session is invalid, sign in again",
        HttpStatus.UNAUTHORIZED
      );
    }
    return auth;
  }

  /** Checks for the tokens validity */
  async decodeToken(token: string) {
    if (!token) {
      throw new HttpException(
        "An access token must be set to access this resource",
        HttpStatus.UNAUTHORIZED
      );
    }
    try {
      // Verify token
      const decoded: IToken = await jwt.verify(
        token,
        process.env.JWT_SECRET_SIGNIN
      );
      return decoded;
    } catch (err) {
      throw new HttpException(
        "Your session is expired, please login again",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  /** if the user is not an admin, @returns false. Else returns true*/
  isAdmin(user: SessionDTO): boolean {
    if (user.role !== Role.ADMIN) {
      return false;
    }
    return true;
  }

  /** if the user is not an admin, @throws an error */
  enforceAdmin(user: SessionDTO) {
    if (!this.isAdmin(user)) {
      throw new HttpException(
        "Only system administrators are allowed to perform this function",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  /*********************** Private Methods ***********************/
  /** generates the response for signed in users */
  private async login(auth: IAuth): Promise<SignedInDTO> {
    const token = await this.generateToken(
      auth,
      process.env.JWT_SECRET_SIGNIN,
      SESSION_EXPIRATION
    );
    const signedIn: SignedInDTO = {
      token,
      role: auth.role,
    };
    return signedIn;
  }

  /** Generates a token using an IAuth object */
  private async generateToken(
    auth: IAuth,
    secret: string,
    expiration?: string
  ): Promise<string> {
    const tokenEntity: IToken = {
      email: auth.email,
      id: auth._id,
      role: auth.role,
      org: auth.org,
    };
    if (expiration) {
      return await jwt.sign(tokenEntity, secret, { expiresIn: expiration });
    } else {
      return await jwt.sign(tokenEntity, secret);
    }
  }

  /** @throws error if the auth is undefined */
  private checkAuth(auth) {
    if (!auth) {
      throw new HttpException(
        "Such user does not exist in our records",
        HttpStatus.NOT_FOUND
      );
    }
  }

  /** @throws error is the password is incorrect */
  private checkPassword(isCorrect) {
    if (!isCorrect) {
      throw new HttpException(
        "user password does not match",
        HttpStatus.FORBIDDEN
      );
    }
  }

  /** @throws error is the new password is not matching the confirmation */
  private confirmPassword(newPass, confirmation) {
    if (newPass !== confirmation) {
      throw new HttpException(
        "The new password does not match with the confirmation",
        HttpStatus.CONFLICT
      );
    }
  }

  /** Check org status, @throws error if the org status is anything but active */
  private checkStatus(status: AuthStatus) {
    switch (status) {
      case AuthStatus.ACTIVE:
        return;
      case AuthStatus.INACTIVE:
        throw new HttpException(
          "This account has been closed by the user",
          HttpStatus.UNAUTHORIZED
        );
      default:
        throw new HttpException(
          "This org seems to be problematic, contact admin",
          HttpStatus.UNAUTHORIZED
        );
    }
  }

  /** Tells the user that the social login provider has an inconsistent state with Armat */
  private checkProviderError(email: string) {
    if (!email) {
      throw new HttpException(
        `Our records show that this social signin was used for an org that does not exist anymore.
        Please login to you social org, disconnect Armat from this id (e.g. appleId) and try to login again or use another method`,
        HttpStatus.EXPECTATION_FAILED
      );
    }
  }
}
//End of Service
