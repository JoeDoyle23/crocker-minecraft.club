FROM node:12-alpine3.10

ENV NODE_ENV production
EXPOSE 3001

WORKDIR /app

COPY package*.json /app/

RUN npm install --production

COPY . /app

ENTRYPOINT ["node", "server"]
