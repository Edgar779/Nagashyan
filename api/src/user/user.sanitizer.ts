import { ISanitize } from '../util';
import { UserDTO } from './dto';
import { IUser } from './interface';

export class UserSanitizer implements ISanitize {
  sanitize(user: IUser): UserDTO {
    const sanitizedUser: UserDTO = {
      id: user.id,
      fullName: user.fullName,
      auth: user.auth,
      email: user.email,
    };
    return sanitizedUser;
  }

  sanitizeMany(users: IUser[]): UserDTO[] {
    const sanitizedUsers: UserDTO[] = [];
    for (let i = 0; i < users.length; i++) {
      sanitizedUsers.push(this.sanitize(users[i]));
    }
    return sanitizedUsers;
  }
}
