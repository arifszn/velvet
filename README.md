# Velvet

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Copy the environment file

```bash
cp .env.example .env
```

### Build and run the Docker containers

```bash
docker compose up --build
```

This will start the application along with any other services defined in the docker-compose.yml file.

### Access the application

The application should now be running at http://localhost:3000 (or the port specified in your docker-compose.yml).

### Running Migrations

```bash
# generate migration (replace CreateUsers with name of the migration)
$ npm run migration:generate --name=CreateUsers

# run migration
$ npm run migration:run

# revert migration
$ npm run migration:revert
```

## Setting up AI

### Answer Document

The `answers.txt` document is a text file that contains all the information. The file should be placed in the `src/data` directory.

```bash
cp src/data/answers.txt.example src/data/answers.txt
```
