import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class LoginUserDto {
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: true, minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
