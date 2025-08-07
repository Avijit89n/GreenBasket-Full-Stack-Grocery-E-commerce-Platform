FROM node:20.15.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "run", "dev", "--", "--host" ]