import { model, Schema, Types } from 'mongoose';
import { Role } from 'src/auth';
import { IUser } from './interface';

const userSchema = new Schema(
  {
    auth: { type: Types.ObjectId, required: true, ref: 'auth' },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: [Role], required: true },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>('user', userSchema);
