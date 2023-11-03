import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RESET_TOKEN } from '../constants';
import { IToken } from '../interface';

@Injectable()
export class ResetPassGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.get(RESET_TOKEN);
    // check if the token is valid
    const decoded: IToken = await this.decodeToken(token);
    request.body.email = decoded.email;
    return true;
  }

  /** Checks for the tokens validity */
  private async decodeToken(token: string): Promise<IToken> {
    if (!token) {
      throw new HttpException(
        'An access token must be set to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      // Verify token
      const decoded: IToken = await jwt.verify(token, process.env.JWT_SECRET_FORGET_PASS);
      return decoded;
    } catch (err) {
      throw new HttpException(
        'Your session is expired, please login again',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
