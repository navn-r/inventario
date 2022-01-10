<p align="center">
  <a href="https://www.youtube.com/watch?v=1P5yyeeYF9o" target="blank"><img src="banner.svg" alt="Logo" /></a>
</p>

## Quick Links

- **Frontend Playground**: https://inventario-server.herokuapp.com/
- **Swagger** (Encouraged): https://inventario-server.herokuapp.com/docs


## Description
> tldr: a backend for tracking a company's inventory with an api to preform basic CRUD operations

### What does Inventario mean? 😕

Inventario means inventory in Italian, I chose this name because of one reason, **developers love searching**. If I had named this project, "Shopify Challenge", or something similar, other potential candidates *could* stumble upon this project by shallow searching on GitHub. 

But hey, if you're here from searching using `&type=Code`, then what's poppin! 👋

### What does Inventario do? 🚀

This current public (unlimited `&&` unauthenticated) API supports the following actions:

- [x] Creating a new inventory item
- [x] Reading (fetching) all inventory items
- [x] Reading (fetching) a single item using its ID
- [x] Updating an item using its ID
- [x] Deleting an item using its ID
- [x] **Additional Feature**: Exporting all inventory items into a `.csv` file

### What does Inventario *not* do? 🤔

The current version does not support:

- [ ] Unlocking the secret to the universe
- [ ] Winning the lottery
- [ ] Saving the world from climate change and total chaos

I cannot guarantee that the above will be supported with later releases, but all contributions are welcome.

### How can I use Inventario? 🧑‍💻

You may clone this repository and run the server locally (see [Local Installation](#local-installation)), *or* check out the [Quick Links](#quick-links) above to either use the interactive playground frontend, and/or read the Swagger documentation.

### What is Inventario built with? 🛠️

- NestJS (Node, Express, TypeScript) 
- MongoDB (Mongoose ODM)
- Swagger (Auto-generated with @nestjs/swagger)
- Heroku
- Docker
- 💖


### Why were *these* technologies chosen for Inventario? 🙋‍♀️
> tldr: they offered the most minimal yet optimal amount of overkill, plus I prefer TypeScript 💞

The goal was to make a simple CRUD backend to showcase development skills and competencies. From my initial planning, there are really two ways to go about this challenge:

1. Do something very minimal, simple. A couple of files and a start script, but in the process disregard any extensibility, maintainability, and scalability.
   
2. Prepare for scalability by making overkill classes/controllers/factories/builders to impress the reviewers, but in the process forget the purpose of the API and *why* we need it in the first place, with respect to the business.

Both approaches have their pros and cons, so it was a good idea to try a combination of both. I'll document my reasoning here, so I can use this README as a resource to look back on in the future, preferably in an interview setting 👀

As a developer (who stands by open source), I have a belief of **don't reinvent the wheel if it doesn't need to be reinvented**. I wanted a tool (or set of tools) that in a way, could do a lot of the heavy boilerplate lifting, like auto generating service layers, or providing first party support for MongoDB and Swagger. NestJS (and its accompanying packages) was that tool.

Let's look at the current file structure:

```bash
├── src
│    ├── app.controller.spec.ts
│    ├── app.controller.ts
│    ├── app.module.ts
│    ├── inventory
│    │   ├── inventory.controller.spec.ts
│    │   ├── inventory.controller.ts
│    │   ├── inventory.exceptions.ts
│    │   ├── inventory.module.ts
│    │   ├── inventory.schema.ts
│    │   └── inventory.service.ts
│    ├── main.ts
│    └── utils.ts
├── views
│   ├── index.tsx
│   └── style.css
└── .env
```

The `/views` directory and the `app.controller.ts` are for handling the frontend, and since the focus of this challenge is on backend/infra, let's just pay attention to that. Our main backend routes are located at `/inventory`. Conveniently, NestJS provides a generator to automagically create a controller and service layer to perform our CRUD operations.

```bash
nest g resource inventory
```

Each method in the controller class (`/inventory/inventory.controller.ts`) is responsible for one endpoint, with decorators for http method type, and appropriate status codes for success and errors. A pro to using NestJS is that the return value of the method in the controller, is actually the response body of the endpoint, and any errors/exceptions thrown are returned to the client with its appropriate messages. 

NestJS provides classes for http exceptions including NotFoundException (404) and BadRequestException (400). To avoiding code reduplication, I chose to extend these base classes, and provide exception classes that 'make more sense' with respect to the product domain. These are `ItemNotFoundException` (404) and `InputValidationException` (400). These classes are found in the `/inventory/inventory.exceptions.ts` file, and the goal is extensibility. So if another endpoint requires business-driven exception class(es), it can follow the same pattern as what I did.

If you're aware of clean architecture, then you should know what `/inventory/inventory.service.ts` does. It interacts with the database model through Mongoose to preform the CRUD operations. This also includes the "**Push a button export product data to a CSV**" feature as requested. I chose to include this logic in this file, versus the controller file, as the parsing logic (from a JSON to a CSV row) is highly coupled/dependant on our model itself, so it only made sense to leave it there. 


Finally, speaking of model, its definition is located in `/inventory/inventory.schema.ts`. Another great thing to come out of using NestJS in tandem with MongoDB is its helper libraries `@nestjs/mongoose` and `@nestjs/swagger`. Using these packages, I avoided a lot of unnecessary code reduplication, by combining these three information, into a **single** source of truth:

1. TypeScript typing for the Inventory Item
2. Mongoose Schema used for interacting with MongoDB
3. Swagger schema used for example request/response bodies

If you (the reader), have used any of these tools, you'd know the pain with keeping track of multiple definitions of the exact same entity. 

In short, I'm very proud on how the backend design came together, especially as I chose the correct tools and design to avoid any unnecessary reduplication. Regardless, I also wrote comments in my code with any assumptions I made, and provided as much clarification as I could as to *why* I made Inventario the way I did. 💖

---

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
> **Requires**: Node 16+, Yarn 1.2x+, and maybe some elbow grease.

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

---

## License

This project is open sourced with the [WTFPL License](LICENSE).
