# Code test - ChatGPT querying microservice

## Functionalities

- Create Import and Export jobs
- Get them grouped by state
- State can be `'pending' | 'finished' | 'error'`
- After <processing_time> set state to `finished`

| Job type     | Processing time (s) |
| ------------ | ------------------- |
| ePub export  | 10                  |
| PDF export   | 25                  |
| import (any) | 60                  |

## Dev notes

For storage I'm using SQLite while keeping the data in a persistent volume `db`.

For the queue, I'm using BullMQ as it provides all necessary functionalities, and it's unnecessary to roll out my own implementation.

Vitest is used to provide extensive integration test coverage.

## Tech stack

- Docker
- NodeJS (Typescript)
- SQLite
- BullMQ
- Redis
- Vitest

## Usage

`docker-compose -f docker-compose.yml up`

## Endpoints

Default port `3000`

- `POST /export-job: ` `{"bookId": string, "type": "epub" | "pdf"}` Adds an export job
- `GET /export-job` Gets all export jobs grouped by state
- `POST /import-job: ` `{"bookId": string, "type": "word" | "pdf" | "wattpad" | "evernote"}` Adds an import job
- `GET /import-job` Gets all import jobs grouped by state

## Dev workflow

`cp server/.env.example server/.env`

`docker-compose -f docker-compose.dev.yml up`

`cd server && npm i && npm run dev:debug`

## Tests

`cd server && npm i && npm run dev:test`

(or use vscode debug console to launch and attach to server)
