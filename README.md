# Bookmark REST API

## Overview
This project is a Bookmark REST API built with [NestJS](https://nestjs.com/), designed to provide a robust and scalable solution for managing bookmarks. The API features user authentication, CRUD operations for bookmarks, and integration with a database for persistent storage.

## Features
- **User Authentication**: Secure authentication using JWT.
- **Bookmark Management**: CRUD operations to create, update, delete, and retrieve bookmarks.
- **Database Integration**: Built with Prisma ORM and supports PostgreSQL.
- **Scalable Design**: Modular architecture for easy maintainability and scalability.
- **Testing**: Comprehensive unit and end-to-end (e2e) tests.

## Technologies Used
- **NestJS**: A progressive Node.js framework for building efficient server-side applications.
- **Prisma ORM**: Simplified database access with type safety.
- **JWT Authentication**: Secure user sessions.
- **Docker**: For containerized development and database management.
- **TypeScript**: Strongly typed JavaScript for improved development experience.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- Docker
- Yarn or npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nestjs-api-tutorial
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure the environment:
    - Copy `.env.example` to `.env` and update the values as needed.

4. Start the database:
   ```bash
   yarn db:dev:up
   ```

5. Run database migrations:
   ```bash
   yarn prisma:dev:deploy
   ```

6. Start the server:
   ```bash
   yarn start:dev
   ```

### Running Tests
- Run unit tests:
  ```bash
  yarn test
  ```
- Run end-to-end tests:
  ```bash
  yarn test:e2e
  ```

## API Documentation
The API is documented with Swagger. Once the server is running, access the API documentation at:
```
http://localhost:3000/api
```

## Scripts
Here are some useful commands:
- `yarn start:dev`: Start the development server.
- `yarn db:dev:up`: Start the development database.
- `yarn db:dev:restart`: Restart the development database.
- `yarn test`: Run all tests.

## License
This project is licensed under the [MIT License](LICENSE).

```

