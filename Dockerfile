FROM node:16.13.1-alpine as builder

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN yarn install \
  && yarn build 

FROM node:16.13.1-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json /usr/src/app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /usr/src/app/
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE $PORT

CMD [ "node", "dist/main.js" ]
