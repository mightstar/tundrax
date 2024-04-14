import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../entities/user.entity";

describe("AuthService", () => {
  let service: AuthService;
  let usersServiceMock: jest.Mocked<UsersService>;
  let jwtServiceMock: jest.Mocked<JwtService>;
  // default database
  const userData: User = {
    id: 1,
    name: "existinguser",
    password: bcrypt.hashSync("password", 10),
    email: "existinguser@gmail.com",
    favourites: null,
    roles: null,
  };

  beforeEach(async () => {
    // Mocking UsersService
    usersServiceMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    // Mocking JwtService
    jwtServiceMock = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return user if credentials are valid", async () => {
      // Mock data
      const email = "testuser@test.com";
      const password = "password";

      // Mocking findByUsername method of UsersService
      usersServiceMock.findByEmail.mockResolvedValueOnce(userData);

      // Mocking bcrypt.compareSync
      jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(true);

      const validatedUser = await service.validateUser(email, password);

      expect(validatedUser).toEqual(userData);
    });

    it("should throw UnauthorizedException if credentials are invalid", async () => {
      // Mock data
      const email = "test@gmail.com";
      const password = "password";

      // Mocking findByUsername method of UsersService
      usersServiceMock.findByEmail.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("register", () => {
    it("should register a new user and return access token", async () => {
      // Mock data
      const createUserDto: CreateUserDto = {
        email: "test@gmail.com",
        name: "newuser",
        password: "password",
      };
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
      const newUser: User = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        favourites: null,
        roles: null,
      };

      // Mocking findByEmail method of UsersService
      usersServiceMock.findByEmail.mockResolvedValueOnce(null);

      // Mocking create method of UsersService
      usersServiceMock.create.mockResolvedValueOnce(newUser);

      // Mocking jwtService.sign
      jwtServiceMock.sign.mockReturnValueOnce("mockedAccessToken");

      const result = await service.register(createUserDto);

      expect(result.access_token).toEqual("mockedAccessToken");
    });
  });
});
