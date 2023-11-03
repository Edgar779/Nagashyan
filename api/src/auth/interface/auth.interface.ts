import { Document } from 'mongoose';
import { AuthStatus, Role } from '../constants';

/** Data type is used to descibe the data model of the Auth collection */
export interface IAuth extends Document {
  org: string;
  email: string;
  password?: string;
  sessions: string[];
  role: Role;
  status: AuthStatus;
  /**Mathods */
  comparePassword?: any;
}
