UID := $(shell id -u)
VERSION := $(shell git describe --tags --dirty --always)

build:
	docker build -t music_database:${VERSION} .

up: build
	env UID=${UID} VERSION=${VERSION} docker-compose up
