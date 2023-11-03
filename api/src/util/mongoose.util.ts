import { HttpException, HttpStatus } from "@nestjs/common";

export class MongooseUtil {
  /** Checks if there is a duplicate key error. If there is, @throws a duplicate key error with the given message */
  checkDuplicateKey = (err, message: string) => {
    if (err && err.code == process.env.MONGO_DUPLICATE_KEY) {
      throw new HttpException(message, HttpStatus.CONFLICT);
    }
  };
}
