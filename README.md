# Schedule Manager

This is a simple schedule manager application that allows you to create, view, and manage meetings.

## Getting Started

1. Clone the repository
2. Run `docker compose up --build` to start the development server and postgres database
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
4. Run the script in package.json to create the database and seed it with some data, run the following command with your favorite package manager.

`pnpm run setup-db`

5. For running the application locally, you'll need to set the environment variables in the .env file to the following:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/schedule_manager

If you want to exec into the db container, you can run the following in your terminal to connect if you have psql installed:

PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres


# Overall Structure:

I tried to use a clean layered architecture approach.

- `src/data-access` contains the data access layer, and interacts with the database.
- `src/business-logic` contains the business logic layer, and interacts with the data access layer.
- `src/utils` contains the utility functions.
- `src/app` contains the next.js application and all the presentation logic. 
- It also contains the api routes and I felt like for my application it made sense to have the api routes to interact directly with my data access layer for CRUD operations.

I setup my own auth page using JWT tokens, I considered using Clerk but I wanted to have a field to store the user's timezones and work hours.