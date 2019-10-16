const { gql } = require('apollo-server');
const { Pet, Owner } = require('../db');
const logger = require('../helpers/logger');

const petTypeDefs = gql`
  type Pet {
    _id: ID!
    name: String
    color: String
    age: Int
    breed: String
    ownerId: String
    owner: Owner
  }

  input PetInput {
    name: String
    color: String
    age: Int
    breed: String
    ownerId: String
  }

  extend type Query {
    pets(filter: Pagination): [Pet]
    pet(id: String!): Pet
  }

  extend type Mutation {
    addPet(input: PetInput!): Pet
    editPet(id: String!, input: PetInput!): Pet
    deletePet(id: String): Pet
  }
`;

const petResolvers = {
  Query: {
    pets: async (_, { filter = {} }) => {
      const limit = filter.limit || 20;
      const offset = filter.offset || 0;

      const pets = await Pet.find({})
        .sort({ createdAt: 'desc' })
        .skip(offset)
        .limit(limit);

      return pets;
    },

    pet: async (_, { id }) => {
      const pet = await Pet.findOne({ _id: id });
      return pet;
    },
  },

  Mutation: {
    addPet: async (_, { input }) => {
      try {
        const pet = await Pet.insert(input);

        return pet;
      } catch (error) {
        logger.error('add pet err:', error);
        return error;
      }
    },

    editPet: async (_, { id, input }) => {
      try {
        await Pet.update({ _id: id }, { $set: input });
        const pet = await Pet.findOne({ _id: id });

        return pet;
      } catch (error) {
        logger.error('edit pet err:', error);
        return error;
      }
    },

    deletePet: async (_, { id }) => {
      try {
        const pet = await Pet.findOne({ _id: id });
        await Pet.remove({ _id: id });

        return pet || null;
      } catch (error) {
        logger.error('delete pet err:', error);
        return error;
      }
    },
  },

  Pet: {
    async owner(pet) {
      const owner = await Owner.findOne({ _id: pet.ownerId });
      if (owner) return owner;
      return null;
    },
  },
};

module.exports = { petTypeDefs, petResolvers };
