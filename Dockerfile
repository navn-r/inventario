FROM node:16.13.1-alpine as builder

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN yarn install \
  && yarn build 

FROM node:16.13.1-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app/

EXPOSE $PORT

CMD [ "node", "dist/src/main.js" ]
