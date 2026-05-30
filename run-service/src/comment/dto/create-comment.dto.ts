import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Put Run ID here' })
  @IsNotEmpty()
  @IsString()
  run_id!: string;

  @ApiProperty({ example: 'Put User ID here' })
  @IsNotEmpty()
  @IsString()
  user_id!: string;

  @ApiProperty({ example: 'Amazing run! The glitch skip at the third minute was flawless.' })
  @IsNotEmpty()
  @IsString()
  comment!: string;
}