import { Injectable } from '@nestjs/common';
import { ISanitize } from '../util';
import { FileDTO } from './dto';
import { IFile } from './interface';

@Injectable()
export class FileSanitizer implements ISanitize {
  sanitize(file: IFile): FileDTO {
    const sanitizedFile: FileDTO = {
      id: file._id,
      url: file.url,
      thumbUrl: file.thumbUrl,
    };
    return sanitizedFile;
  }

  sanitizeMany(files: IFile[]): FileDTO[] {
    const sanitized: FileDTO[] = [];
    for (let i = 0; i < files.length; i++) {
      sanitized.push(this.sanitize(files[i]));
    }
    return sanitized;
  }
}
