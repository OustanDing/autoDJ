# React application Dockerfile

FROM node:10.22.0-alpine

WORKDIR /application

ENV PATH /application/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY . ./

EXPOSE 3001

CMD ["npm", "start"]

