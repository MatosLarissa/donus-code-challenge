FROM node:16.15-alpine as build

WORKDIR /usr/app

COPY package*.json ./ 

RUN npm install

COPY . .

FROM node:16.15-alpine as run

WORKDIR /usr/app

COPY package.json ./
COPY .env ./
COPY tsconfig.* ./
RUN npm install --production

ENV TZ=America/Sao_Paulo

CMD ["npm", "run", "start"]