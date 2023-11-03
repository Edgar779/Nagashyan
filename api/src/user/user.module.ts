import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserSanitizer } from './user.sanitizer';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthZModule } from 'src/authZ/authZ.module';

@Module({
  imports: [AuthModule, AuthZModule],
  controllers: [UserController],
  providers: [UserService, UserSanitizer],
  exports: [UserService],
})
export class UserModule {}
