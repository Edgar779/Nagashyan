import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionDTO } from '../dto';
import { IRequest } from '../../util';
import { AuthService } from '../auth.service';
import { ACCESS_TOKEN } from '../constants';
import { Reflector } from '@nestjs/core';

/** Authorization and Authentication guard. Checks if the user has enough privilages to access a resource and whether the user is Authenticated */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /** Route is not public, check the token */
    const request: IRequest = context.switchToHttp().getRequest();
    const token: string = request.get(ACCESS_TOKEN);
    if (!token) {
      /** Check if the route is public */
      if (this.isPublic(context)) {
        return true;
      }
    }
    //Decoded token
    const decoded = await this.authService.decodeToken(token);
    const auth = await this.authService.getSession(decoded.id, token);
    //Make the org available to the rest of the system
    const user: SessionDTO = {
      id: auth._id.toHexString(),
      email: auth.email,
      role: auth.role,
      token: token,
    };
    request.body.user = user;
    request.user = user;
    return true;
  }

  /** Private Methods */
  /** Check if the public is set */
  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>('isPublic', context.getHandler());
    // return false;
  }
}
