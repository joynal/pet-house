const { Owner, Pet } = require('../db');
const { owners, pets } = require('./fixtures');

const run = async () => {
  // clean previous records and insert owners
  await Owner.remove({}, { multi: true });
  await Owner.insert(owners);

  // clean previous records and insert pets
  await Pet.remove({}, { multi: true });
  await Pet.insert(pets);
};

run();
