import { Injectable } from '@nestjs/common';
import { ISanitize } from 'src/util';
import { AuthDTO } from './dto';
import { IAuth } from './interface';

@Injectable()
export class AuthSanitizer implements ISanitize {
  sanitize(auth: IAuth): AuthDTO {
    const sanitized: AuthDTO = {
      // permissions: auth.permissions,
    };
    return sanitized;
  }

  sanitizeMany(auths: IAuth[]): AuthDTO[] {
    const sanitized: AuthDTO[] = [];
    for (let i = 0; i < auths.length; i++) {
      sanitized.push(this.sanitize(auths[i]));
    }
    return sanitized;
  }
}
