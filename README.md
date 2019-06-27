# Prepared Adventurer

Project for Praktikum 1 at Universität of Wien.

The project considers in doing a Monolith application at first, and then splitting intro micro-services

## Requirements

To run the application, 3 things will be needed:

-   [Gradle](https://gradle.org/), to run the backend.
-   [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/), to run the frontend
-   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) to run the container running the database.

## Preparation

To install all the dependencies:

-   Gradle will automatically pick up the dependencies before running, so there is no preparation step needed.
-   To install the dependencies for the frontend, it's needed to run, in the root of the project, the command `$ npm install`
-   For the database, the container will be fetched when running, so there is no prerequisite step.

## Execution

To run the application:

-   The first step would be running the container for the database:
    -   Navigate to `src/main/docker`
    -   Run the command `$ (sudo) docker-compose up -d`. 'Sudo' might be needed depending on the Docker installation. This will fetch the image for the container and run it on the background.
-   To run the backend, on the root of the project, run `$ ./gradlew -Pprod`
-   To run the frontend, it's needed to run `$ npm start`

The order is key, since the backend needs the database running.
