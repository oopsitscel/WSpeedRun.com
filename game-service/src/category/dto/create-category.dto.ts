import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({example: '550e8400-e29b-41d4-a716-446655440000'})
  @IsNotEmpty()
  @IsString()
  game_id!: string;

  @ApiProperty({example: 'Any%'})
  @IsNotEmpty()
  @IsString()
  run_category_name!: string;
}