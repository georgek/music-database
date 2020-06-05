# Music Database

Doing some front end stuff with a music database.

## Database

This is configured to use the Chinook database from https://github.com/lerocha/chinook-database/

The tables are not managed by Django.

### Postgres

Using postgres can be done easily by using docker-compose:

```
docker-compose build
docker-compose up -d
docker-compose exec django manage.py migrate
```

### SQLite

To use SQLite, copy the `Chinook_Sqlite.sqlite` to the root and run:

```
export DATABASE_URL=sqlite:///Chinook_Sqlite.sqlite
./manage.py migrate
./manage.py runserver
```
