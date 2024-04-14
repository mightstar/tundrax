import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { Cat } from "../entities/cat.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cat, User])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
