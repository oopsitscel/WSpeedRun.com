import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe'})
  @IsNotEmpty()
  @IsString()
  @Length(4, 40)
  username!: string;

  @ApiProperty({ example: 'john@mail.com'})
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Indonesia'})
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ example: 'P@ssword123'})
  @IsNotEmpty()
  @IsString()
  @Length(8, 40)
  password!: string;
}