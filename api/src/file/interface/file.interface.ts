import { Document } from 'mongoose';

export interface IFile extends Document {
  url: string;
  uploader: string;
  thumbUrl?: string;
}
