import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({example: '550e8400-e29b-41d4-a716-446655440000'})
  @IsOptional()
  @IsString()
  game_id?: string;

  @ApiPropertyOptional({example: '100% Glitchless'})
  @IsOptional()
  @IsString()
  run_category_name?: string;
}