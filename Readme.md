## How to start

It has to be an `.env` file. Sample: `.env-sample`

### Checking node version

```bash
node -v # 16.14.0
```

### Installing packages

```bash
npm install
```

### Start server

```bash
npm run start # listens via port number in local .env file
# or
npm run dev
```

## Documentation

[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## Migrations

### How to create a migration

```bash
npm run migration:add -- --name="$migrationName"
```

### How to run migrations

```bash
npm run migration:up
```

### How to undo migration

```bash
npm run migration:down
```

## Test

### How to run unit test

```bash
npm run test:unit
```

### How to run integration test

```bash
npm run test:integration
```

## How to create dev db with docker

```bash
docker run --name docker-mysql  \
-p 3306:3306 -p 3306:3306  \
-e MYSQL_ROOT_HOST='%' -e MYSQL_ROOT_PASSWORD='123456'   \
-d mysql/mysql-server:5.7
```
