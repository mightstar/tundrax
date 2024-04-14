import { Test, TestingModule } from "@nestjs/testing";
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;
  const token: any = { access_token: "sample-jwt-token" };

  beforeEach(async () => {
    // Mocking AuthService
    authServiceMock = {
      validateUser: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe("login", () => {
    it("should return a JWT token if login is successful", async () => {
      const user: any = {
        email: "testuser",
        password: "testpassword",
      };

      jest
        .spyOn(authServiceMock, "validateUser")
        .mockImplementation(async () => user);
      jest.spyOn(authServiceMock, "login").mockImplementation(() => token);

      const result = await authController.login(user);

      expect(result).toEqual(token);
    });

    it("should throw UnauthorizedException if login is unsuccessful", async () => {
      const user: any = {
        email: "testuser",
        password: "wrongpassword",
      };

      authServiceMock.validateUser.mockResolvedValue(null);

      await expect(authController.login(user)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("register", () => {
    it("should return a JWT token if registration is successful", async () => {
      const createUserDto: any = {
        email: "newuser@gmail.com",
        password: "password",
        name: "user",
      };

      authServiceMock.register.mockResolvedValue(token);

      const result = await authController.register(createUserDto);

      expect(result).toEqual(token);
    });

    it("should throw ConflictException if registration fails due to existing username", async () => {
      const createUserDto: any = {
        name: "existinguser",
        password: "password123!@#",
        email: "test@test.com",
      };

      authServiceMock.register.mockRejectedValue(new ConflictException());

      await expect(authController.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it("should throw BadRequestException if email is invalid or password is not strong", async () => {
      const createUserDto: any = {
        email: "existinguser",
        password: "password",
      };

      authServiceMock.register.mockRejectedValue(new BadRequestException());

      await expect(authController.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
