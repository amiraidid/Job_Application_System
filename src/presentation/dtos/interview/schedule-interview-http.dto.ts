import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleInterviewHttpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  interviewerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  time: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
