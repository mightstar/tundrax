import { createConnection } from "typeorm";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { Cat } from "../entities/cat.entity";
import { config as dotenvConfig } from "dotenv";
import * as bcrypt from "bcrypt";

dotenvConfig({ path: ".env.development" });

async function seed() {
  // Create a database connection
  const connection = await createConnection({
    type: "postgres",
    host: `${process.env.POSTGRES_HOST}`,
    port: parseInt(`${process.env.POSTGRES_PORT}`),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DATABASE}`,
    migrations: ["../src/migrations/*{.ts,.js}"],
    entities: [Role, User, Cat],
    synchronize: true,
  });

  // Insert roles
  const rolesRepository = connection.getRepository(Role);
  const roles = [{ name: "admin" }, { name: "user" }, { name: "moderator" }];
  await rolesRepository.save(roles);

  // Insert admin user
  const adminRole = (await rolesRepository.findOne({
    where: { name: "admin" },
  })) as Role; // Type assertion

  const userRole = (await rolesRepository.findOne({
    where: { name: "user" },
  })) as Role; // Type assertion

  const userRepository = connection.getRepository(User);
  const adminUser = new User();
  adminUser.name = "Admin";
  adminUser.email = "admin@example.com";
  adminUser.password = await bcrypt.hash("adminpassword", 10);
  adminUser.roles = [adminRole, userRole];
  await userRepository.save(adminUser);

  // Close the connection
  await connection.close();
}

seed()
  .then(() => console.log("Seeder executed successfully"))
  .catch((error) => console.error("Error seeding the database:", error));
