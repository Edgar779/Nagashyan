import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileStorage } from './file.storage';
import { FileSanitizer } from './file.sanitizer';

@Module({
  providers: [FileService, FileStorage, FileSanitizer],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
