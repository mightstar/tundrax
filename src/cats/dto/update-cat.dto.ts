import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { CreateCatDto } from "./create-cat.dto";

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly age?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly breed?: string;
}
