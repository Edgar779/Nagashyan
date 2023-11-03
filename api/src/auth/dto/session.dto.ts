import { Role } from '..';

export class SessionDTO {
  id: string;
  email: string;
  role: Role;
  token: string;
}
