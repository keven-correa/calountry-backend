import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  description: string;
}
