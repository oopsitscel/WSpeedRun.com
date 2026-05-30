import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRunDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  run_category_id!: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'})
  @IsString()
  @IsNotEmpty()
  vod_url!: string;

  @ApiProperty({ example: 3600})
  @IsNotEmpty()
  @IsNumber()
  run_duration!: number;
}