import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard, JwtAuthGuard } from "../common/guards";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { CatsService } from "./cats.service";
import { CreateCatDto, UpdateCatDto } from "./dto";
import { Cat } from "./interfaces/cat.interface";
import { User } from "../entities/user.entity";

@UseGuards(RolesGuard) // Apply RolesGuard globally to the controller
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // Create a new cat (only admins)
  @Post()
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  // Get all cats
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  // Get a specific cat by ID
  @Get(":id")
  findOne(@Param("id", new ParseIntPipe()) id: number) {
    return this.catsService.findOne(id);
  }

  // Update a cat by ID (only admins)
  @Put(":id")
  @Roles(["admin"])
  async update(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() cat: UpdateCatDto,
  ): Promise<Cat> {
    return this.catsService.update(id, cat);
  }

  // Delete a cat by ID (only admins)
  @Delete(":id")
  @Roles(["admin"])
  async delete(@Param("id", new ParseIntPipe()) id: number): Promise<string> {
    return this.catsService.remove(id);
  }

  // Mark a cat as favorite for a user (only to authenticated users)
  @Post(":id/favorite")
  @Roles(["user"])
  @UseGuards(JwtAuthGuard)
  async markAsFavorite(
    @Param("id") catId: number,
    @Req() req: any,
  ): Promise<string> {
    const user: User = req.user;
    return this.catsService.markAsFavorite(catId, user.id);
  }
}
