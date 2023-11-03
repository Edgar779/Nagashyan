import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthSanitizer } from './auth.sanitizer';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards';

@Module({
  exports: [AuthService],
  providers: [
    AuthService,
    AuthSanitizer,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule { }
