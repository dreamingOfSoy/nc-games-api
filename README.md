# NC-Games API

**TRY IT NOW**: `https://nc-games-api-viuk.onrender.com/api`

### Documentation

Environment Variables: Following the .env-example files (.env-development-example, .env-test-example), create appropriate .env.development and .env.test files for your environment variables.

### What is this project?

This project was undertaken to focus learning on utilising node.js, express, SQL, and TDD (test driven development) to build a RESTful API. It contains various endpoints to GET reviews of board games, and GET and POST comments onto those reviews. (This project is still in development, and will soon be consumed by a react frontend to create a full-stack application).

### How to run this locally

To run this locally, you can first clone the repo from GitHub. After you've cloned into onto your system, run `npm install`, to install all relevant dependencies. You can then run `npm run setup-dbs` to initialise the databases on your local system.

To run the server in development, run `npm run start:dev`, this will seed the database, and allow you to interact with the test data. To interact with the production data, you can run `npm run start` instead. Please refer to the package.json for all available scipts.

To run tests simply type `npm test`.

### Versions

This project was built using node v`16.13.1` and postgresql v`8.7.3`.
