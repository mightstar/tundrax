import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCatDto, UpdateCatDto } from "./dto";
import { Cat } from "../entities/cat.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Create a new cat
  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const { name, age, breed } = createCatDto;
    const newCat = await this.catsRepository.create({ name, age, breed });
    return await this.catsRepository.save(newCat);
  }

  // Get all cats
  async findAll(): Promise<Cat[]> {
    return await this.catsRepository.find();
  }

  // Get a specific cat by its ID
  async findOne(id: number): Promise<Cat | null> {
    return await this.catsRepository.findOneBy({ id });
  }

  // Remove a cat by its ID
  async remove(id: number): Promise<string> {
    await this.catsRepository.delete(id);
    return "Cat removed";
  }

  // Update a cat by its ID
  async update(id: number, cat: UpdateCatDto): Promise<Cat | null> {
    const existedCat = await this.catsRepository.findOneBy({ id });
    if (!existedCat) return null;

    existedCat.name = cat.name;
    existedCat.age = cat.age;
    existedCat.breed = cat.breed;

    // Save the updated cat entity back to the database
    return this.catsRepository.save(existedCat);
  }

  // Mark a cat as favorite for a user
  async markAsFavorite(id: number, userId: number): Promise<string> {
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new Error("Cat not found");
    }

    // Fetch user data with favorites by ID
    const newUser = await this.usersRepository.findOne({
      relations: {
        favourites: true,
      },
      where: {
        id: userId,
      },
    });

    if (!newUser) {
      throw new Error("User not found");
    }

    // Add the cat to the user's list of favorites
    newUser.favourites.push(cat);

    // Save the updated user entity back to the database
    await this.usersRepository.save(newUser);

    return "Added cat as favorite";
  }
}
