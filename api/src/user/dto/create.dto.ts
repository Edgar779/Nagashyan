import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { DTO } from 'src/util';
import { Role } from 'src/auth';
// import { FileDTO } from 'src/components/file';

export class CreateUserDTO extends DTO {
  @ApiProperty({
    type: String,
    description: 'Lenght must be min 3 characters long',
  })
  @MinLength(2)
  fullName: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    description: 'must be at least 8 characters long, contain 1 uppercase 1 lowercase',
  })
  @MinLength(8)
  @MaxLength(30)
  password: string;

}

export class CreateWorkerDTO extends DTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  businessId: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    description: 'Lenght must be min 3 characters long',
  })
  @MinLength(2)
  fullName: string;
  @ApiProperty({
    type: String,
    description: 'must be at least 8 characters long, contain 1 uppercase 1 lowercase',
  })
  @MinLength(8)
  @MaxLength(30)
  password: string;
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}