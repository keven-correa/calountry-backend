import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  start: Date;

  @IsNotEmpty()
  @ApiProperty()
  end: Date;

  @IsOptional()
  @ApiProperty()
  color: string;

  @ApiProperty()
  @IsOptional()
  timed: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  description: string;
}
