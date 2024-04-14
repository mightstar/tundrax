import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  readonly email!: string;

  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({ required: true, minLength: 8 })
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
