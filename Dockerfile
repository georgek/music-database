FROM node:13 as node_builder
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install
RUN npm run build

FROM python:3.6-slim as python_builder
RUN seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{}
RUN apt-get update && apt-get install -y --no-install-recommends \
        git build-essential pkg-config libpq-dev

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN mkdir /code
WORKDIR /code
COPY . /code/
RUN pip install -e .[psycopg]

FROM python:3.6-slim as python_runner
ENV PYTHONUNBUFFERED 1
COPY --from=python_builder /opt/venv /opt/venv
COPY --from=python_builder /code /code
COPY --from=node_builder /home/node/app/dist/* /code/music_database/frontend/static/frontend/

WORKDIR /code
ENV PATH="/opt/venv/bin:$PATH"
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
