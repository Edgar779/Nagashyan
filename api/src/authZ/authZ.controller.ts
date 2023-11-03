import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('authz')
@ApiTags('Authorization')
export class AuthZController {}
