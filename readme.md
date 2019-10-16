<p align="center">
  <img src="puppy.jpg" alt="Pet House GraphQL API" width="250"/>
</p>


# Pet House

## Features

- Owner & pet's GraphQL API
- Test coverage
- Logging in the file by `winston`
- Docker deploy
- Used filesystem database by `nedb`
- Embedded initial data set
- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await
- Eslint configured

## Requirements

- Node v10.15.0+ or Docker
- npm

## Step 1: Clone the repo

```bash
git clone git@github.com:joynal/pet-house.git
cd pet-house
```

## Step 2: Start the server

### Without docker

Install packages:

```
$ npm i
```

Running in development:

```bash
npm run dev
```

Running in production

```bash
npm run start
```

### With Docker

```bash
# run container in development
npm run docker:dev

# run container in production
npm run docker:prod
```

Wait a couple of seconds while docker container is starting. The application container will start in the background.

### Stop docker container

Get container id by running:

```bash
docker ps -a
```

Stop docker container:

```bash
docker stop <CONTAINER_ID>
```

## Run tests

```
$ npm run test
```

## Logs

All logs will be stored & synced from docker container into the `logs` directory. File rotation is enabled by date wise.

To view real-time logging from docker:

```bash
docker logs -f <CONTAINER_ID>
```

## Deploy

Replace my docker username & ssh server with yours:

```bash
vim deploy.sh
```

Deploy script:

```bash
npm run deploy
```

## Queries & mutations

Let's play with the backend. Go to host URL, in my case; it is `http://localhost:4000/`

Owner's API:

```javascript
// get the list of owners
query getOwners {
  owners(filter: { limit: 20, offset: 0 }) {
    _id
    name
    address
    phone
    email
    pets {
      _id
      name
    }
  }
}

// get a owner details
query getOwnerDetails {
  owner(id: "imT1p0oJ3gU0Bo3n") {
    _id
    name
    address
    phone
    email
    pets {
      _id
      name
    }
  }
}

// create an owner
mutation CreateOwner {
  addOwner(
    input: {
      name: "Joynal"
      email: "joynal@gmail.com"
      address: "Dhaka"
    }
  ) {
    name
    email
    address
  }
}

// update a owner
mutation EditOwner {
  editOwner(id: "lwdoL7fUYFvuwVHH", input:{
    phone: "0999346",
    address: "Rajshahi",
  }) {
    _id
    name
    address
    phone
    email
  }
}

// delete a owner
mutation DeleteOwner {
  deleteOwner(id: "z4CxyHolWfHmm1tq") {
    _id
  }
}
```

Pet's API:

```javascript
// get list of pets
query getPets {
  pets(filter: { limit: 20, offset: 0 }) {
    _id
    name
    color
    breed
    ownerId
  }
}

// get a pet details
query getPetDetails {
  pet(id: "4S2AOCNKQ3NaubWb") {
    _id
    name
    color
    breed
    ownerId
  }
}

// create a pet
mutation CreatePet {
  addPet(input:{
    name: "Kutti"
    age: 2
    color: "White"
    breed: "Collins"
    ownerId: "Rmplca4avD8yurgP"
  }) {
    name
    color
    breed
    owner {
      name
    }
  }
}

// update a pet
mutation EditPet {
  editPet(id: "2eabYdJRPhMMNRUX", input: {
    name: "Bulldog",
    color: "black",
  }) {
    _id
    name
    color
  }
}

// delete a pet
mutation DeletePet {
  deletePet(id: "JkVbIktQ0V1vxCKR") {
    _id
  }
}
```

## Generate dummy data

Data set already embedded into the filesystem. In case you want to regenerate it, here is how to do it.

```
$ node test/seed.js
```

## Back to the initial data set

Just remove your changes, you can easily do it by git:

```bash
git checkout .
```

## Author

**Joynal Abedin** - [Joynal](https://twitter.com/joynaluu)

## License

This project is licensed under the MIT License - see the [license](./license) file for details
