# Tundrax Code Challenge Documentation

## Overview
Welcome to the Tundrax API documentation. This API allows you to manage cat profiles, handle user authentication, and enable users to mark cats as favorites. It is built with Nest.js, utilizing PostgreSQL as the database managed by TypeORM. User authentication is implemented using Passport.js with JWT tokens. Input validation and serialization are handled using class-validator and class-transformer.

## Technical Stack
- **Database**: PostgreSQL with TypeORM.
- **Authentication**: Passport.js with JWT tokens.
- **Validation and Serialization**: class-validator and class-transformer.

## Endpoints

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Authenticate a user and obtain a JWT token.
- **GET /cats**: Retrieve a list of all cats.
- **POST /cats**: Create a new cat profile (restricted to admins).
- **GET /cats/{id}**: Retrieve a cat profile by ID.
- **PUT /cats/{id}**: Update a cat profile by ID (restricted to admins).
- **DELETE /cats/{id}**: Delete a cat profile by ID (restricted to admins).

## Installation
1. Clone the repository: `git clone https://github.com/mightstar/tundrax`
2. Navigate to the project directory: `cd tundrax`
3. Install dependencies: `npm install`

## Configuration
1. Ensure you have PostgreSQL installed and running.
2. Configure the database connection in the `src/config/typeorm.ts` file.
3. Set environment variables as needed, such as JWT secret and database credentials, using a `.env` file.

### Database Management CLI Commands:
- **Migration Creation**: Create a new migration file.
  ```bash
  npm run migration:create --name=mymigration
- **Generate Migration**: Generate SQL migration scripts based on changes in entities.
  ```bash
  npm run migration:generate --name=mymigration
- **Run Migrations**: Execute pending migrations to update the database schema.
  ```bash
  npm run migration:run
- **Revert Migrations**: Revert the last executed migration.
  ```bash
  npm run migration:revert
- **Seed Database**: Populate the database with seed data, such as an admin user.
  ```bash
  npm run seed
  ```

## Usage
- **Development**: `npm run start:dev`
- **Production**: `npm run start:prod`

## Testing
- **Run tests**: `npm test`
- **Run tests with coverage**: `npm run test:cov`

