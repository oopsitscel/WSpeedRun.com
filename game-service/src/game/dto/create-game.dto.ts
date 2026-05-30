import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'Minecraft' })
  @IsNotEmpty()
  @IsString()
  game_name!: string;

  @ApiProperty({
    example: 'A sandbox game focused on building, exploration, and survival.',
  })
  @IsNotEmpty()
  @IsString()
  description!: string;
}
