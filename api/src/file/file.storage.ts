import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY, AWS_REGION, IMAGE_BUCKET } from './constants';
import * as url from 'url';

@Injectable()
export class FileStorage {
  constructor() {
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_SECRET_KEY,
      },
    });
  }
  private s3Client: S3Client;

  //adding new files to the S3
  storeImage = async (file, folder?: string): Promise<string> => {
    const fileName = Date.now().toString() + file.originalname;
    const key = folder ? folder + '/' + fileName : fileName;
    const params: PutObjectCommandInput = {
      Bucket: IMAGE_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    await this.s3Client.send(new PutObjectCommand(params));
    const location = `https://${IMAGE_BUCKET}.s3-${AWS_REGION}.amazonaws.com/${key}`;
    return location;
  };

  /** Multi file upload */
  storeImages = async (files: any[], folder?: string): Promise<string[]> => {
    const promises = files.map((file) => this.storeImage(file, folder));
    const locations = await Promise.all(promises);
    return locations;
  };

  //removes files from the s3 bucket
  deleteImages = (fileUrls: string[]): Promise<unknown> => {
    console.log(fileUrls, 'trying to delete files');
    const objects = [];
    for (let i = 0; i < fileUrls.length; i++) {
      //extract the pathname from the url
      let pathname = url.parse(fileUrls[i]).pathname;
      //remove the beginning slash
      pathname = pathname.slice(1, pathname.length);
      pathname = decodeURI(pathname);
      objects.push({
        Key: pathname,
      });
    }
    const params: DeleteObjectsCommandInput = {
      Bucket: IMAGE_BUCKET,
      Delete: {
        Objects: objects,
      },
    };
    return this.s3Client.send(new DeleteObjectsCommand(params));
  };
}
