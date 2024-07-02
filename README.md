<br/>
<p align="center">
  <img src="https://github.com/arifszn/velvet/assets/45073703/4a1fcde5-d62f-40cd-8fba-bbf8a7d21902" width="35%">

  <h4 align="center">📦 REST API Starter Kit/Boilerplate powered by Node.js, Express.js, and TypeORM.</h4>

  <p align="center">
    <a href="https://github.com/arifszn/velvet/actions/workflows/test.yml"><img src="https://github.com/arifszn/velvet/actions/workflows/test.yml/badge.svg"/></a>
    <a href="https://github.com/arifszn/velvet/issues"><img src="https://img.shields.io/github/issues/arifszn/velvet"/></a>
    <a href="https://github.com/arifszn/velvet/stargazers"><img src="https://img.shields.io/github/stars/arifszn/velvet"/></a>
    <a href="https://github.com/arifszn/velvet/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"/></a>
    <a href="https://github.com/arifszn/velvet/blob/main/LICENSE"><img src="https://img.shields.io/github/license/arifszn/velvet"/></a>
    <a href="https://twitter.com/intent/tweet?url=https://github.com/arifszn/velvet&hashtags=node,opensource,express,typescript,api"><img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Farifszn%2Fvelvet"/></a>
  </p>

  <p align="center">
    <a href="https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/arifszn/velvet/main/src/api-docs.json">API Docs</a>
    ·
    <a href="https://github.com/arifszn/velvet/issues">Report Bug</a>
    ·
    <a href="https://github.com/arifszn/velvet/discussions">Request Feature</a>
  </p>
</p>

**Velvet** is a modern, customized, minimal API starter kit to kickstart your next _REST_ API backend. This project provides a robust foundation for building modern, scalable, and maintainable web applications using Node.js, Express, TypeScript, and various other tools and libraries.

## Features

- **Dockerized Environment:** Easily set up and manage your development environment using Docker.
- **CLI for Resource Generation:** Quickly generate resource files (controller, service, repository, DTO, entity, and route) using the CLI tool.
- **Service Repository Pattern:** Maintain a clean and modular codebase with a well-structured service repository pattern.
- **Zod Validation:** Ensure data integrity with schema-based validation using Zod.
- **Class Transformer DTOs:** Clean and transform your data with Class Transformer.
- **Swagger UI and Redoc UI:** Automatically generate and visualize your API documentation.
- **ESLint and Prettier:** Enforce coding standards and ensure a consistent code style.
- **Winston Logging:** Centralized and customizable logging using Winston.
- **GitHub Actions:** CI/CD workflows for testing and linting.

## Getting Started

### Installation

### Copy the environment file

```bash
cp .env.example .env
```

### Build and run the Docker containers

```bash
docker compose up
```

This will start the application along with any other services defined in the docker-compose.yml file.

### Access the application

The application should now be running at [`http://localhost:3000`](http://localhost:3000) (or the port specified in your docker-compose.yml).

### Running Migrations

To run the migrations, you can use the following commands inside the Docker container:

#### Generate Migration

```bash
npm run migration:generate --name=CreateUsers
```

Replace `CreateUsers` with name of the migration.

#### Run Migration

```bash
npm run migration:run
```

#### Revert Migration

```bash
npm run migration:revert
```

## Generating Resources

One of the key features of this starter kit is the ability to quickly generate new resources (e.g., controllers, services, repositories, DTOs, entities, and routes) using the CLI tool.

### Generate a new resource

- Run the generate command:

  ```bash
  npm run generate
  ```

- Follow the prompts to enter the resource name and select the file types to generate.

### Example

To generate a new resource called `Article`, run the command and follow the prompts:

```bash
  npm run generate
```

- Enter the resource name: `Article`
- Select the files to generate: `entity`, `repository`, `service`, `controller`, `route`, `dto`

This will generate the following files:

- `src/entities/article.entity.ts`
- `src/repositories/article.repository.ts`
- `src/services/article.service.ts`
- `src/controllers/article.controller.ts`
- `src/routes/articles.ts`
- `src/dtos/article.dto.ts`

The generated files will be pre-configured and ready for use, allowing you to focus on implementing your business logic.

Remember to create a migration for the new entity and add the route to the index route (src/routes/index.ts).

## API Documentation

This starter kit comes with integrated API documentation tools. You can access the Swagger UI and Redoc UI for your API documentation.

- Swagger UI: [`http://localhost:3000/swagger`](http://localhost:3000/swagger)
- Redoc UI: [`http://localhost:3000/redoc`](http://localhost:3000/redoc)

You can also access the online API documentation [here](https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/arifszn/velvet/main/src/api-docs.json).

## Folder Structure

The project follows a modular folder structure:

```css
src/
  ├── configs/           # Application configurations
  ├── constants/         # Application constants
  ├── controllers/       # Route controllers
  ├── dtos/              # Data Transfer Objects
  ├── entities/          # TypeORM entities
  ├── exceptions/        # Custom exceptions
  ├── interfaces/        # TypeScript interfaces
  ├── middlewares/       # App middlewares
  ├── migrations/        # Database migrations
  ├── repositories/      # Data access layer
  ├── routes/            # API routes
  ├── services/          # Business logic layer
  ├── utils/             # Utility functions
  ├── app.ts             # Application setup
.env                     # Environment variables
docker-compose.yml       # Docker Compose configuration
Dockerfile               # Docker configuration
tsconfig.json            # TypeScript configuration
.eslintrc.js             # ESLint configuration
.prettierrc              # Prettier configuration
```

## Admin Routes

To access the admin routes, the authenticated user's `isAdmin` column must be set to `true` in the database. You can update the `isAdmin` field using Adminer, a database management tool accessible at [`http://localhost:8080`](http://localhost:8080).

## Support

<p>You can show your support by starring this project.</p>
<a href="https://github.com/arifszn/velvet/stargazers">
  <img src="https://img.shields.io/github/stars/arifszn/velvet?style=social" alt="Github Star">
</a>

## Contribute

To contribute, see the [contributing guide](https://github.com/arifszn/velvet/blob/main/CONTRIBUTING.md).

## License

[MIT License](https://github.com/arifszn/velvet/blob/main/LICENSE)
