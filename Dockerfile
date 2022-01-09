# syntax=docker/dockerfile:1

FROM node:12.18.1

RUN apt-get update

WORKDIR /pattern-backend

COPY package*.json ./

RUN npm install

COPY app.js ./

COPY ./api ./api

COPY ./views ./views

COPY ./css ./css

COPY ./test ./test

CMD [ "npm", "start" ]
