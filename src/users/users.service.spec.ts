import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersService", () => {
  let service: UsersService;
  let usersServiceMock: jest.Mocked<UsersService>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    // Mocking UsersService
    usersServiceMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByEmail", () => {
    it("should return a user if found", async () => {
      const email = "test@example.com";
      const user: User = {
        id: 1,
        name: "user",
        email,
        password: "password",
        favourites: null,
        roles: null,
      };

      jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValueOnce(user);

      const result = await service.findByEmail(email);

      expect(result).toEqual(user);
    });

    it("should return undefined if user not found", async () => {
      const username = "nonexistentuser";

      jest.spyOn(userRepository, "findOneBy").mockResolvedValueOnce(undefined);

      const result = await service.findByEmail(username);

      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        name: "test",
        email: "test@example.com",
        password: "password",
      };
      const newUser: User = {
        id: 1,
        ...createUserDto,
        favourites: null,
        roles: null,
      };

      jest.spyOn(usersServiceMock, "create").mockResolvedValueOnce(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
    });
  });
});
