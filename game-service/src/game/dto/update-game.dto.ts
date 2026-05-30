import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from 'class-validator';

export class UpdateGameDto {
  @ApiPropertyOptional({ example: 'Minecraft 2.0' })
  @IsOptional()
  @IsString()
  game_name?: string;

  @ApiPropertyOptional({ example: 'Updated Description'})
  @IsOptional()
  @IsString()
  description?: string;
}