import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import typeorm from "./config/typeorm";

import { CatsModule } from "./cats/cats.module";
import { CoreModule } from "./core/core.module";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users";
import { LoggerMiddleware, AuthMiddleware } from "./common/middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get("typeorm"),
    }),
    CoreModule,
    CatsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*")
      .apply(AuthMiddleware)
      .forRoutes("*");
  }
}
