FROM node:7.2.0-alpine
COPY ./app /app
COPY ./ssl /ssl
WORKDIR /app
RUN npm install && npm start
