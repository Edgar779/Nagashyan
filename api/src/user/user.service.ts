import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SessionDTO, SignedInDTO } from 'src/auth/dto';
// import { SubscriptionService } from '../subscription/subscription.service';
import { Role, SocialDTO } from '../auth';
import { AuthService } from '../auth/auth.service';
import { MongooseUtil } from '../util';
import { CreateUserDTO, CreateWorkerDTO, EditUserDTO, UserDTO } from './dto';
import { IUser } from './interface';
import { UserModel } from './user.model';
import { UserSanitizer } from './user.sanitizer';
import { AuthZService } from 'src/authZ/authZ.service';

@Injectable()
export class UserService {
  constructor(
    private readonly sanitizer: UserSanitizer,
    private readonly authService: AuthService,
    private readonly authZService: AuthZService,
  ) {
    this.model = UserModel;
    this.mongooseUtil = new MongooseUtil();
  }
  private model: Model<IUser>;
  private mongooseUtil: MongooseUtil;

  /** Service API */
  /** Used for creating a new user in the system with email and password. @throws if the email is a duplicating */
  // ONLY FOR DEVELOPMENT
  async create(dto: CreateUserDTO): Promise<SignedInDTO> {
    try {
      let user = await this.model.findOne({ email: dto.email });
      if (user) throw new HttpException('User already exists', HttpStatus.CONFLICT);
      user = new this.model({
        email: dto.email,
        fullName: dto.fullName,
        role: Role.ADMIN,
      });
      user.auth = user._id;
      const [singedInResponse] = await Promise.all([
        this.authService.create(user._id, dto.email, dto.password, Role.ADMIN),
        user.save(),
      ]);
      return singedInResponse;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'User already exists');
      throw err;
    }
  }

  /** find by customer id */
  async findByCusId(customerId: string): Promise<UserDTO> {
    const user = await this.model.findOne({ customerId }).populate('auth');
    this.checkUser(user);
    return user;
  }

  /** Used to update the fullname and email of the user */
  async edit(dto: EditUserDTO): Promise<UserDTO> {
    const user = await this.model.findById(dto.user.id);
    this.checkUser(user);
    const tasks = [];
    if (dto.email) {
      const otherUser = await this.model.findOne({ email: dto.email });
      this.checkDuplicateEmail(otherUser, dto.user.id);
      user.email = dto.email;
      const authEmail = await this.authService.changeEmail(dto.user.id, dto.email);
      this.checkAuthEmail(authEmail, user.email);
    }
    if (dto.fullName) user.fullName = dto.fullName;
    tasks.push(user.save());
    await Promise.all(tasks);
    return this.sanitizer.sanitize(user);
  }

  /**  Get the user profile */
  async get(userId: string): Promise<UserDTO> {
    const user = await this.model.findById(userId).populate('auth');
    this.checkUser(user);
    // const sub = await this.subService.getSubscription(user._id);
    // if (sub) {
    //   user.package = sub.package; Harut commented temporarly
    // }
    return this.sanitizer.sanitize(user);
  }

  /** Get users */
  async getAll(): Promise<UserDTO[]> {
    const users = await this.model.find().populate('auth', 'package');
    return this.sanitizer.sanitizeMany(users);
  }

  /** Private Methods */
  /** Chack if the user was found */
  private checkUser(user: IUser) {
    if (!user) {
      throw new HttpException('No such user was found', HttpStatus.NOT_FOUND);
    }
  }

  /** Checks if there is a duplicate user.
   * @param user - the potential duplicate user
   * @param id - the id of the user trying to make the change
   */
  private checkDuplicateEmail(user: IUser, id: string) {
    if (user && user._id !== id) {
      throw new HttpException('This email is already used in the system', HttpStatus.CONFLICT);
    }
  }

  /** checks if the auth email has been successfully update */
  private checkAuthEmail(authEmail: string, email: string) {
    if (authEmail !== email) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
