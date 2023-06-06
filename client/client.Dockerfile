FROM node:14-alpine as build

WORKDIR /usr/src/app-client

COPY package*.json ./
RUN npm install

ADD . /usr/src/app-client

EXPOSE 8080

CMD ["npm", "run", "serve"]
