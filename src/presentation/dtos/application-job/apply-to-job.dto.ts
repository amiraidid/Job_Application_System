import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyToJobHttpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobId: string;
}
