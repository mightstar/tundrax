import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class CreateCatDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly name!: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  readonly age!: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly breed!: string;
}
