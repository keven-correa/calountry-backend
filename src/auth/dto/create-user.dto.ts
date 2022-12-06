import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../enums/user.roles';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  user_name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(1)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  gmt_zone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  phone_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  technologies: string;
}
