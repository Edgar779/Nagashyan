import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthZService {

  /** Checks if the role is allowed. Throws if no match is found */
  checkRole(role: string, allowedRoles: string[]) {
    if (!this.hasRole(role, allowedRoles)) {
      throw new HttpException(
        `To do this action, the user role needs to be in ${allowedRoles} role(s)`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
 * Checks if the user role is allowed (matches an item in allowed statuses).
 * @return true if it does or false if it doesnt
 */
  hasRole(status: string, allowedRoles: string[]) {
    if (!allowedRoles || allowedRoles?.length < 1) return true;
    for (let i = 0; i < allowedRoles.length; i++) {
      if (status === allowedRoles[i]) return true;
    }
    return false;
  }
}
