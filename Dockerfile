FROM node:16.13.1-alpine as builder

RUN npm install -g pnpm@6.24.4

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN pnpm i \
  && npm run build \
  && pnpm prune --production

FROM node:16.13.1-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json /usr/src/app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /usr/src/app/
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
