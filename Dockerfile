FROM python:3.6-slim AS builder
RUN seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{}
RUN apt-get update && apt-get install -y --no-install-recommends \
        git build-essential pkg-config libpq-dev
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY . /code/
RUN pip install -e .[psycopg]
COPY dist/* /code/music_database/frontend/static/frontend/
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
