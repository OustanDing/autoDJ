# Express API Dockerfile

FROM node:15.10.0

WORKDIR /api

COPY package*.json ./

RUN npm install --silent

COPY . ./

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start:dev"]