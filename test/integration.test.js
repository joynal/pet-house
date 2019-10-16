const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const server = require('../server');
const { Owner, Pet } = require('../db');
const { owners, pets } = require('./fixtures');

const { query, mutate } = createTestClient(server);

const GET_SINGLE_PET = gql`
  query getSinglePet($id: String!) {
    pet(id: $id) {
      _id
      name
      color
      breed
      ownerId
    }
  }
`;

describe('Integration test pet, owner:', () => {
  afterAll(async () => {
    server.stop();

    // clean previous records and insert owners
    await Owner.remove({}, { multi: true });
    await Owner.insert(owners);

    // clean previous records and insert pets
    await Pet.remove({}, { multi: true });
    await Pet.insert(pets);
  });

  describe('Queries', () => {
    it('should return all owners', async () => {
      const res = await query({
        query: gql`
          query getOwners {
            owners {
              _id
              name
              phone
              email
            }
          }
        `,
      });

      const list = res.data.owners;
      expect(list.length).toBeGreaterThan(0);
      expect(Object.keys(list[0])).toEqual(
        expect.arrayContaining(['name', 'phone', 'email']),
      );
    });

    it('should return a single owner', async () => {
      const res = await query({
        query: gql`
          query getSingleOwner($id: String!) {
            owner(id: $id) {
              _id
              name
              phone
              email
            }
          }
        `,
        variables: { id: 'imT1p0oJ3gU0Bo3n' },
      });

      const want = 'santiago68@hotmail.com';
      const got = res.data.owner.email;
      expect(got).toBe(want);
    });

    it('should return all pets', async () => {
      const res = await query({
        query: gql`
          query getPets {
            pets {
              _id
              name
              color
              breed
              ownerId
            }
          }
        `,
      });

      const list = res.data.pets;
      expect(list.length).toBeGreaterThan(0);
      expect(Object.keys(list[0])).toEqual(
        expect.arrayContaining(['name', 'color', 'breed', 'ownerId']),
      );
    });

    it('should return a single pet', async () => {
      const res = await query({
        query: GET_SINGLE_PET,
        variables: { id: '4S2AOCNKQ3NaubWb' },
      });

      const petData = res.data.pet;
      expect(petData.ownerId).toBe('Rmplca4avD8yurgP');
      expect(petData.name).toBe('Nicolas');
      expect(petData.color).toBe('green');
      expect(petData.breed).toBe('Marquardt');
    });

    it('should return null if pet does not exist', async () => {
      const res = await query({
        query: GET_SINGLE_PET,
        variables: { id: 'doesnoexist' },
      });
      expect(res.data.pet).toBe(null);
    });
  });

  describe('Mutations', () => {
    describe('owner add:', () => {
      it('should return the owner that was added', async () => {
        const res = await mutate({
          query: gql`
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
          `,
        });

        const owner = res.data.addOwner;
        expect(owner.name).toBe('Joynal');
        expect(owner.email).toBe('joynal@gmail.com');
        expect(owner.address).toBe('Dhaka');
      });
    });

    describe('owner update:', () => {
      const EDIT_OWNER = gql`
        mutation EditOwner($id: String!, $phone: String, $address: String) {
          editOwner(id: $id, input: { phone: $phone, address: $address }) {
            _id
            address
            phone
          }
        }
      `;

      it('should return the owner that was updated', async () => {
        const res = await mutate({
          query: EDIT_OWNER,
          variables: {
            id: 'lwdoL7fUYFvuwVHH',
            phone: '0999346',
            address: 'Rajshahi',
          },
        });

        const owner = res.data.editOwner;
        expect(owner.phone).toBe('0999346');
        expect(owner.address).toBe('Rajshahi');
      });

      it('should return null if owner does not exist', async () => {
        const res = await mutate({
          query: EDIT_OWNER,
          variables: {
            id: 'does_not_exist',
            phone: '0999346',
            address: 'Rajshahi',
          },
        });

        const owner = res.data.editOwner;
        expect(owner).toBe(null);
      });
    });

    describe('owner delete:', () => {
      const DELETE_OWNER = gql`
        mutation DeleteOwner($id: String!) {
          deleteOwner(id: $id) {
            _id
            name
            email
          }
        }
      `;

      it('should return the owner that was deleted', async () => {
        const res = await mutate({
          query: DELETE_OWNER,
          variables: {
            id: 'z4CxyHolWfHmm1tq',
          },
        });

        const owner = res.data.deleteOwner;
        expect(owner.name).toBe('Garrison Cremin MD');
        expect(owner.email).toBe('bette73@gmail.com');
      });

      it('should return null if owner does not exist', async () => {
        const res = await mutate({
          query: DELETE_OWNER,
          variables: {
            id: 'does_not_exist',
          },
        });

        const owner = res.data.deleteOwner;
        expect(owner).toBe(null);
      });
    });

    // pet mutation tests
    describe('pet add:', () => {
      it('should return the pet that was added', async () => {
        const res = await mutate({
          query: gql`
            mutation CreatePet {
              addPet(
                input: {
                  name: "Kutti"
                  age: 2
                  color: "White"
                  breed: "Collins"
                  ownerId: "Rmplca4avD8yurgP"
                }
              ) {
                name
                color
                breed
                owner {
                  name
                }
              }
            }
          `,
        });

        const pet = res.data.addPet;
        expect(pet.name).toBe('Kutti');
        expect(pet.color).toBe('White');
        expect(pet.breed).toBe('Collins');
        expect(pet.owner.name).toBe('Fleta Toy');
      });
    });

    describe('pet update:', () => {
      const EDIT_PET = gql`
        mutation EditPet($id: String!, $name: String, $color: String) {
          editPet(id: $id, input: { name: $name, color: $color }) {
            _id
            name
            color
          }
        }
      `;

      it('should return the pet that was updated', async () => {
        const res = await mutate({
          query: EDIT_PET,
          variables: {
            id: '2eabYdJRPhMMNRUX',
            name: 'Bulldog',
            color: 'black',
          },
        });

        const pet = res.data.editPet;
        expect(pet.name).toBe('Bulldog');
        expect(pet.color).toBe('black');
      });

      it('should null if pet does not exist', async () => {
        const res = await mutate({
          query: EDIT_PET,
          variables: {
            id: 'does_not_exist',
            name: 'Bulldog',
          },
        });

        const pet = res.data.editPet;
        expect(pet).toBe(null);
      });
    });

    describe('pet delete:', () => {
      const DELETE_PET = gql`
        mutation DeletePet($id: String!) {
          deletePet(id: $id) {
            _id
            name
            color
          }
        }
      `;

      it('should return the pet that was deleted', async () => {
        const res = await mutate({
          query: DELETE_PET,
          variables: {
            id: 'JkVbIktQ0V1vxCKR',
          },
        });

        const pet = res.data.deletePet;
        expect(pet.name).toBe('Bartoletti');
        expect(pet.color).toBe('yellow');
      });

      it('should null if pet does not exist', async () => {
        const res = await mutate({
          query: DELETE_PET,
          variables: {
            id: 'does_not_exist',
          },
        });

        const pet = res.data.deletePet;
        expect(pet).toBe(null);
      });
    });
  });
});
