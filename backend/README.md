# Backend - Todo API

This is the backend API for the Todo application, built with Node.js, Express, and PostgreSQL.

## Technologies Used

*   **Framework:** [Express 5](https://expressjs.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (via `pg` driver)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Testing:** [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), [Supertest](https://github.com/ladjs/supertest)
*   **Logging:** [Winston](https://github.com/winstonjs/winston)

## Getting Started

### Prerequisites

*   Node.js (version 20 or higher recommended)
*   PostgreSQL database instance
*   npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the root of the backend directory (refer to `.env.example` if available, or review the codebase for required variables such as database connection parameters).

### Available Scripts

In the project directory, you can run:

*   **`npm start`**: Runs the app in development mode using `nodemon` with live reload.
*   **`npm run check`**: Runs the TypeScript compiler without emitting files to check for type errors.
*   **`npm test`**: Runs the test suite using `ts-mocha`.
*   **`npm run test:coverage`**: Runs the test suite and generates a code coverage report using `nyc`.
*   **`npm run test:file`**: Useful for running specific test files or testing without file globbing restrictions.

## Project Structure

*   `controller`: API request handlers.
*   `services`: Business logic and database interactions.
*   `middlewares`: Express middleware functions (e.g., error handling, validation).
*   `utilities`: Helper functions and shared utilities.
*   `model`: Database schemas, interfaces, or DAOs.
*   `test`: Integration and unit tests.
