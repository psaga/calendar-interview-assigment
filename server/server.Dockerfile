FROM node:14-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ADD . /usr/src/app

RUN npm run build

CMD ["npm", "run", "dev"]

EXPOSE 3000