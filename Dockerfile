FROM node:18-slim

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-fund

COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]
