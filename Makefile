UID := $(shell id -u)
VERSION := $(shell git describe --tags --dirty --always)

build:
	docker build -t music_database:${VERSION} .

up: build
	env UID=${UID} VERSION=${VERSION} docker-compose up -d

up-prod: build
	env UID=${UID} VERSION=${VERSION} docker-compose \
	   -f docker-compose.yaml \
	   -f docker-compose.prod.yaml \
	   up --remove-orphans -d
