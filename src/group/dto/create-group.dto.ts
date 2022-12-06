import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(45)
  name: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;

  @ApiProperty()
  @IsUUID(undefined, { each: true })
  users?: string[];
}
