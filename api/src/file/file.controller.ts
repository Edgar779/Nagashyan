import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFiles,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IRequest, ParseObjectIdPipe } from '../util';
import { FileService } from './file.service';
import { FileDTO } from './dto';

@Controller('files')
@ApiTags('File Endpoints')
export class FileController {
  constructor(private readonly imagesService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  async uploadImage(
    @Query('includeThumbnail') includeThumbnail: boolean,
    @UploadedFile() file,
    @Req() req: IRequest,
  ): Promise<FileDTO> {
    const uploadedFile = await this.imagesService.create(file, req.user.id, includeThumbnail);
    return uploadedFile;
  }

  @Post('uploadMany')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Query('includeThumbnail') includeThumbnail: boolean,
    @UploadedFiles() files,
    @Req() req: IRequest,
  ) {
    const uploadedFiles = await this.imagesService.createMany(req.user.id, files, includeThumbnail);
    return uploadedFiles;
  }

  /** Get a file by id */
  @Get(':id')
  @ApiOkResponse({ type: FileDTO })
  async get(@Param('id', ParseObjectIdPipe) id: string): Promise<FileDTO> {
    const file = await this.imagesService.get(id);
    return file;
  }

  /** Delete an image from the system */
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string, @Body('user') uploader: string): Promise<any> {
    const file = await this.imagesService.deleteFile(uploader, id);
    return file;
  }
}
