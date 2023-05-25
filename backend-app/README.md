# DEVICES APP API

## Description

This project is a node.js backend project build with [AdonisJS](https://adonisjs.com/),
[PostgreSql](https://www.postgres.com/), [Docker](https://www.docker.com/) and [Redis](https://redis.io/)


## Installation and starting the server

```bash
$ cp .env.dev .env
```

```bash
$ docker-compose up
```
After setting up your environment, make sure to create a postgres server in pgAdmin and run the migration command to have your
database ready for the project. Please all the instructions are down below.

## Stopping the server

```bash
$ docker-compose down
```

## Specific running of the app

### Connect to the api container

```bash
$ docker exec -it api-container /bin/bash
```

```bash
# development
$ yarn dev
```

## Access the Api
### Once everything start, the api can be accessed at:
```
http://api.devices-app.localhost
```

## PgAdmin
### You can visualize and change database records at:
```
http://db-client.devices-app.localhost
```
You should connect with the login information in the .env.dev file and create a server named: "devices-app".

## Migrating the tables

### Connect to the api-container (the command should be executed inside the container)

```bash
$ docker exec -it api-container /bin/bash
```

### Migrating the tables

```bash
$ node ace migration:run
```

## Test
### Connect to the api container

```bash
$ docker exec -it core-api-container /bin/bash
```

```bash
$ yarn test
```

### Exit the api container

```bash
$ exit
```
