import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "../users/dto";
import { ValidationPipe } from "../common/pipes/validation.pipe";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint for user login
  @Post("login")
  async login(@Body() user: LoginUserDto): Promise<any> {
    // Transform received data to DTO instance
    const userDto = plainToClass(LoginUserDto, user);

    // Validate user credentials
    const authenticatedUser = await this.authService.validateUser(
      userDto.email,
      userDto.password,
    );

    // If user is not authenticated, throw UnauthorizedException
    if (!authenticatedUser) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    // If user is authenticated, return the access token
    return this.authService.login(authenticatedUser);
  }

  // Endpoint for user registration
  @Post("register")
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<any> {
    // Transform received data to DTO instance
    const userDto = plainToClass(CreateUserDto, createUserDto);

    // Validate user data using class-validator
    const errors = await validate(userDto);

    // If validation errors exist, throw BadRequestException with the validation errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      // Attempt to register the user
      return await this.authService.register(userDto);
    } catch (error) {
      // If registration fails due to conflict (e.g., user already exists), throw ConflictException
      throw new ConflictException(error.message);
    }
  }
}
