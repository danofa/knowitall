FROM node:7.2.0-alpine
COPY ./app/package.json /app/
WORKDIR /app
RUN npm install
