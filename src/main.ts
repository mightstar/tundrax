import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import validationPipeService from "@pipets/validation-pipes";

async function bootstrap() {
  try {
    validationPipeService();
    // Create the NestJS application instance
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    // Initialize Passport authentication middleware
    app.use(passport.initialize());
    // Load JWT authentication strategy
    require("./auth/strategies/jwt.strategy");

    // Configure Swagger documentation
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Restful API for cats' profile")
      .setDescription("Restful API for cats' profile - test assessment")
      .setVersion("1.0")
      .addServer("http://localhost:3000", "Local environment")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api-docs", app, document);

    // Start listening on port 3000
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {
    console.error("Error occurred during application bootstrap:", err);
  }
}

bootstrap();
