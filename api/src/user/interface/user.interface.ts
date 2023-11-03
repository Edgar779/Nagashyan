import { Document } from 'mongoose';
import { IAuth } from 'src/auth/interface';
import { Role } from 'src/auth';

export interface IUser extends Document {
  id: string;
  auth: IAuth['_id'];
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
}
