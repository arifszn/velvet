FROM node:20-slim

WORKDIR /usr/src/app

ARG PORT

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]