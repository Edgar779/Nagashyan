import { Module } from '@nestjs/common';
import { AuthZController } from './authZ.controller';
import { AuthZService } from './authZ.service';
@Module({
  controllers: [AuthZController],
  providers: [AuthZService],
  exports: [AuthZService],
})
export class AuthZModule { }
