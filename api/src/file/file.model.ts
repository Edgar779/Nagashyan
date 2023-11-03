import { Schema, model, Types } from 'mongoose';
import { IFile } from './interface';

export const fileSchema = new Schema({
  uploader: { type: Types.ObjectId, ref: 'user' },
  url: { type: String, required: true },
  thumbUrl: { type: String },
});

export const FileModel = model<IFile>('file', fileSchema);

export const FileSchema = new Schema(
  {
    url: { type: String },
    thumbUrl: { type: String },
    id: { type: String },
  },
  { _id: false },
);
