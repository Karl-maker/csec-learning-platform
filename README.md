# Learner Hub 

Welcome to CSEC LearnerHub!

## Introduction

This project aims to bring exam questions into students' hands by providing an API for client applications to give quizzes and access resources. 

## Requirements

To run this project locally, you will need:
- Node.js (v20.10.0)
- MySQL database
- `.env` file with your MySQL database URL (Refer to `.env.example`)

## Technologies Used

- TypeScript
- Express.js
- Prisma

## Project Structure

This project follows clean architecture principles with the following file structure:

```
src/
│
├── adapters/
│   ├── controllers/
│   └── repositories/
│
├── entities/
│
├── framework/
│
├── usecases/
│
└── services/
```

## Getting Started

1. Clone this repository.
2. Install dependencies using `yarn install`.
3. Create a `.env` file with your MySQL database URL.
4. Run Prisma migrations and generate Prisma client:
   ```
   npx prisma migrate dev
   npx prisma generate
   ```
5. Build the project using `npm run build`.
6. Start the development server using `npm run dev`.
7. You can also start the server in production mode using `npm run start`.

We recommend using Yarn for managing dependencies and running scripts.

## Resources

- [Prisma](https://www.prisma.io/docs)

If you have any questions or need further assistance, feel free to contact us. Happy coding!