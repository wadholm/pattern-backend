# syntax=docker/dockerfile:1

FROM node:12.18.1

RUN apt-get update

ENV NODE_ENV=production

WORKDIR /pattern-backend

COPY package*.json ./

RUN npm install --production

COPY app.js ./

COPY ./api ./api

COPY ./views ./views

CMD [ "npm", "start" ]
