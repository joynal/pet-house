const { gql } = require('apollo-server');
const { Pet, Owner } = require('../db');
const logger = require('../helpers/logger');

const ownerTypeDefs = gql`
  type Owner {
    _id: ID!
    name: String
    address: String
    phone: String
    email: Email
    pets: [Pet]
  }

  input OwnerInput {
    name: String
    address: String
    phone: String
    email: Email
  }

  input Pagination {
    limit: Int
    offset: Int
  }

  extend type Query {
    owners(filter: Pagination): [Owner]
    owner(id: String!): Owner
  }

  extend type Mutation {
    addOwner(input: OwnerInput!): Owner
    editOwner(id: String!, input: OwnerInput!): Owner
    deleteOwner(id: String): Owner
  }
`;

const ownerResolvers = {
  Query: {
    owners: async (_, { filter = {} }) => {
      const limit = filter.limit || 20;
      const offset = filter.offset || 0;

      const owners = await Owner.find({})
        .sort({ createdAt: 'desc' })
        .skip(offset)
        .limit(limit);

      return owners;
    },

    owner: async (_, { id }) => {
      const owner = await Owner.findOne({ _id: id });
      return owner;
    },
  },

  Mutation: {
    addOwner: async (_, { input }) => {
      try {
        const owner = await Owner.insert(input);

        return owner;
      } catch (error) {
        logger.error('add owner err:', error);
        return error;
      }
    },

    editOwner: async (_, { id, input }) => {
      try {
        await Owner.update({ _id: id }, { $set: input });
        const owner = await Owner.findOne({ _id: id });

        return owner;
      } catch (error) {
        logger.error('edit owner err:', error);
        return error;
      }
    },

    deleteOwner: async (_, { id }) => {
      try {
        const owner = await Owner.findOne({ _id: id });
        await Owner.remove({ _id: id });

        return owner;
      } catch (error) {
        logger.error('delete owner err:', error);
        return error;
      }
    },
  },

  Owner: {
    async pets(owner) {
      const pets = await Pet.find({ ownerId: owner._id });
      return pets;
    },
  },
};

module.exports = { ownerTypeDefs, ownerResolvers };
