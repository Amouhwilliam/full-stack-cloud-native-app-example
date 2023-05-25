# Devices-app

This project is a Typescript full-stack project built With Adonis.js 5 for the backend With Docker-compose as Container
orchestrator, PostgreSQL for backend, React.js as frontend Framework and pure typescript to build the API Sdk.

## Here are the steps to run the project

### Backend
Create the .env file base on the .env.dev file and run the backend with the `docker-compose up` command then access
the PgAdmin web page, create a server and the database. After creating the database run the migration in the api-container
to create the devices table.

Please Follow the backend README.md file for more insights

### SDK
Run the `yarn install` to install the packages and then build the sdk with `yarn build` in order to access it on the frontend

### Frontend
Create the .env file base on the .env.dev, run the `yarn install` to install the packages and then run `yarn start` to run the project.
Or run `yarn build` and `yarn global add serve` and then run `serve -s build` to start the build version.
