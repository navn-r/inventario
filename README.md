<p align="center">
  <a href="https://www.youtube.com/watch?v=1P5yyeeYF9o" target="blank"><img src="banner.svg" alt="Logo" /></a>
</p>

## Quick Links

- **Swagger**: https://inventario-server.herokuapp.com/docs


## Description

**TODO**

### What does Inventario mean?

Inventario means inventory in Italian, I chose this name because of one reason, **developers love searching**. If I had named this project, "Shopify Challenge", or something similar, other potential candidates *could* stumble upon this project by shallow searching on GitHub. 

But hey, if you're here from searching using `&type=Code`, then what's poppin! 👋

### Technology 

- NestJS (Node, Express, TypeScript) 
- MongoDB (Mongoose ODM)
- Swagger
- Heroku
- Docker
- 💖

## Local Installation

### Prerequisite

You must create a `.env` file at the root of the project, with the following

```env
MONGO_URI=<mongo_uri>
```
where `<mongo_uri>` is replaced with a [MongoDB connection URI](https://docs.mongodb.com/manual/reference/connection-string/).

### Docker
> **Warning**: Do not use if allergic to whales, the color blue, or containerization.

```bash
# build image
docker build -t inventario .

# run container
docker run -p 3000:3000 --env-file .env inventario
```

### Without Docker
> **Requires**: Node 16+, pnpm 6.24.4+, and maybe some elbow grease.

```bash
# install dependencies
yarn

# development (http://localhost:3000)
yarn start

# build
yarn run build

# serve build/prod code (/dist)
yarn run start:prod
```

## License

This project is open sourced with the [WTFPL License](LICENSE).
