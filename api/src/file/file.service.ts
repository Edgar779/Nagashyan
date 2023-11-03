import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileStorage } from './file.storage';
import * as sharp from 'sharp';
import { FileDTO } from './dto';
import { Model } from 'mongoose';
import { IFile } from './interface';
import { FileModel } from './file.model';
import { FileSanitizer } from './file.sanitizer';

@Injectable()
export class FileService {
  constructor(private readonly storage: FileStorage, private readonly sanitizer: FileSanitizer) {
    this.model = FileModel;
  }
  private model: Model<IFile>;

  /** upload a new file to S3 and create the record of that file in mongodb */
  create = async (fileData: any, uploaderId?: string, thumb?: boolean): Promise<FileDTO> => {
    if (!fileData) return null;
    let files;
    if (thumb) {
      const thumbnail = await this.createThumbnail(fileData);
      files = await Promise.all([this.storage.storeImage(fileData), this.storage.storeImage(thumbnail)]);
    } else {
      files = [await this.storage.storeImage(fileData)];
    }
    const file = new this.model({
      url: files[0],
      uploader: uploaderId,
      thumbUrl: files[1] ? files[1] : undefined,
    });
    await file.save();
    return this.sanitizer.sanitize(file);
  };

  /** Get a file by its Id */
  get = async (id: string): Promise<FileDTO> => {
    const file = await this.model.findById(id);
    this.checkFile(file);
    return this.sanitizer.sanitize(file);
  };

  /** Saves multiple images for the event */
  createMany = async (uploader: string, files: any[], thumb?: boolean) => {
    return await Promise.all(files.map((file) => this.create(file, uploader, thumb)));
  };

  deleteFile = async (uploaderId: string, fileId: string) => {
    const file = await this.model.findById(fileId);
    if (!file) return;
    this.checkUploader(uploaderId, file);
    const urls = [];
    urls.push(file.url);
    if (file.thumbUrl) {
      urls.push(file.thumbUrl);
    }
    const [_, removed] = await Promise.all([this.storage.deleteImages(urls), file.deleteOne()]);
    return removed._id;
  };

  /** Delete a file from s3 and the record from the DB */
  deleteFiles = async (uploaderId: string, fileIds: string[]): Promise<number> => {
    const files = await this.model.find({ _id: { $in: fileIds }, uploader: uploaderId });
    if (!files || files.length < 1) return 0;
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(files[i].url);
      if (files[i].thumbUrl) {
        urls.push(files[i].thumbUrl);
      }
    }
    const [_, removed] = await Promise.all([
      this.storage.deleteImages(urls),
      this.model.deleteMany({ _id: { $in: fileIds } }),
    ]);
    return removed.deletedCount;
  };

  /** Only save an image to s3 */
  saveImage = async (file): Promise<string> => {
    return await this.storage.storeImage(file);
  };

  /** Private Methods */
  private checkFile(file: IFile) {
    if (!file) {
      throw new HttpException('file with was not found', HttpStatus.NOT_FOUND);
    }
  }

  private checkUploader(uploaderId: string, file: IFile) {
    if (file.uploader.toString() !== uploaderId) {
      throw new HttpException('User can only delete files they have uploaded', HttpStatus.UNAUTHORIZED);
    }
  }

  /** Takes a file and creates a 200 x 200 pixel thumbnail version of it */
  private async createThumbnail(file) {
    if (!file) return undefined;
    const thumbnailBuffer = await sharp(file.buffer).resize({ width: 200, height: 200, fit: 'cover' }).toBuffer();
    return {
      originalname: 'thumbnail_' + file.originalname,
      mimetype: file.mimetype,
      buffer: thumbnailBuffer,
    };
  }
}
