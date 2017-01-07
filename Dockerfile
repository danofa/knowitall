FROM node:7.2.0-alpine
COPY ./app /app
WORKDIR /app

RUN npm install
ENTRYPOINT npm start
