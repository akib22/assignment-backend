## Overview

A simple backend server for an e-commerce site. See [Live demo](https://assignment-shop-backend.herokuapp.com/).

## Available routes

- Public
  - GET `/`
  - GET `/api/products`
  - GET `/api/products/search?title='test'`
  - POST `/api/user/signup`
  - POST `/api/user/signin`
- Private
  - GET `/api/products/wishlist`
  - PATCH `api/wishlist/add`
  - DELETE `api/wishlist/remove`

## Project setup

### Prerequisites

- On your system, you should have `node` (v16.14.0 lts) and `npm` (v8.3.1) installed. Install `node` and `npm` if you don't already have them.

### Clone the project

```
git clone https://github.com/akib22/assignment-backend.git

cd assignment-backend
```

### Install dependencies

```
npm i
```

### Setup environment variables

- Copy the `.env.example` file and paste it into root in project directory as `.env`.
- Open the `.env` file and set the `MONGODB_URL`, `JWT_SECRET`.

### Run the project

- Run the project

```
  npm start
```

- Run the project in development node

```
  npm run dev
```

### Run tests

```
  npm run test
```

- In watch mode

```
  npm run test:watch
```

### See linting warnings and errors

```
  npm run lint
```

### Fix linting warnings and errors

```
  npm run lint:fix
```
