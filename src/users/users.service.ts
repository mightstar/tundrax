import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { CreateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  // Find a user by email
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      relations: ["roles"], // specify relations
      where: { email },
    });

    return user;
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    // Create a new user entity
    const newUser = await this.usersRepository.create({
      name,
      email,
      password,
    });

    // Assign the "user" role to the new user
    newUser.roles = [];
    const savedUserRole = await this.rolesRepository.findOne({
      where: { name: "user" },
    });
    if (!savedUserRole) {
      throw new InternalServerErrorException("Default role 'user' not found.");
    }
    newUser.roles.push(savedUserRole);

    // Save the new user to the database
    const savedUser = await this.usersRepository.save(newUser);

    if (!savedUser) {
      throw new InternalServerErrorException(
        "Unable to create user. Please try again.",
      );
    }

    return savedUser;
  }
}
