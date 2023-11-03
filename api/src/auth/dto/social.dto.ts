import { Role } from '../constants';

/** Data type is used to interact with passport to get and create the req.user object*/
export class SocialDTO {
  email: string;
  id?: string;
  providerKey?: string;
  fullName?: string;
  avatar?: string;
  socialId?: string;
  role?: Role;
  package?: number;
  packageCreated?: Date;
  org?: string;
}
