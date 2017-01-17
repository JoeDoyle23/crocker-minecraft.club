FROM node:6-slim

ENV NODE_ENV production
EXPOSE 3001

WORKDIR /app

COPY ./package.json /app

RUN npm install --production

ADD ./ /app

ENTRYPOINT ["node", "server"]