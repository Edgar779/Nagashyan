import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      if (Types.ObjectId.isValid(value)) {
        if (new Types.ObjectId(value).toString() == value) {
          return value;
        }
      }
    }
    throw new HttpException('Invalid Id for the resource', HttpStatus.BAD_REQUEST);
  }
}

export class ParseObjectIdsPipe implements PipeTransform {
  transform(value: any) {
    if(!value){
      throw new HttpException('Invalid Id for the resource', HttpStatus.BAD_REQUEST);
    }
    if (typeof value == 'string') {
      if (Types.ObjectId.isValid(value)) {
        if (new Types.ObjectId(value).toString() == value) {
          return value;
        }
      }
    }
    const invalidIds = value.filter(id => !Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      throw new HttpException(`Invalid Id for the resource`, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
