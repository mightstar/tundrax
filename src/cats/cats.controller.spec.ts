import { Test, TestingModule } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { Cat } from "../entities/cat.entity";

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: jest.Mocked<CatsService>;

  beforeEach(async () => {
    // Mocking Cats Service
    catsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      markAsFavorite: jest.fn(),
    } as unknown as jest.Mocked<CatsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: catsService }],
    }).compile();

    catsController = module.get<CatsController>(CatsController);
  });

  describe("create", () => {
    it("should create a new cat", async () => {
      const createCatDto: CreateCatDto = {
        name: "Cutty",
        age: 2,
        breed: "Sanna",
      };

      const newCat: Cat = {
        id: 1,
        ...createCatDto,
        users: null,
      };

      jest.spyOn(catsService, "create").mockResolvedValue(newCat);

      await expect(catsController.create(createCatDto)).resolves.not.toThrow();
    });
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result: Cat[] = [
        { id: 1, name: "Cutty", age: 2, breed: "Sanna", users: null },
        { id: 2, name: "Whiskers", age: 3, breed: "Siamese", users: null },
      ];

      jest.spyOn(catsService, "findAll").mockResolvedValue(result);

      const cats = await catsController.findAll();

      expect(cats).toEqual(result);
    });
  });

  describe("findOne", () => {
    it("should return a cat by ID", async () => {
      const catId = 1;
      const result: Cat = {
        id: 1,
        name: "Cutty",
        age: 2,
        breed: "Sanna",
        users: null,
      };

      jest.spyOn(catsService, "findOne").mockResolvedValue(result);

      const cat = await catsController.findOne(catId);

      expect(cat).toEqual(result);
    });
  });

  describe("update", () => {
    it("should update a cat by ID", async () => {
      const catId = 1;
      const updateCatDto: UpdateCatDto = {
        name: "Cutty",
        age: 3,
        breed: "Sanna",
      };
      const result: Cat = {
        id: 1,
        name: "Cutty",
        age: 3,
        breed: "Sanna",
        users: null,
      };

      jest.spyOn(catsService, "update").mockResolvedValue(result);

      const updatedCat = await catsController.update(catId, updateCatDto);

      expect(updatedCat).toEqual(result);
    });
  });

  describe("delete", () => {
    it("should remove a cat by ID", async () => {
      const catId = 1;

      jest.spyOn(catsService, "remove").mockResolvedValue("Cat removed");

      await expect(catsController.delete(catId)).resolves.not.toThrow();
    });
  });
});
