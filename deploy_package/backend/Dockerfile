FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN node ./node_modules/@nestjs/cli/bin/nest.js build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
