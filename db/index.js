const DataStore = require('nedb-promises');

const db = {};

db.Pet = DataStore.create({
  autoload: true,
  timestampData: true,
  filename: './db/pet.db',
});

db.Owner = DataStore.create({
  autoload: true,
  timestampData: true,
  filename: './db/owner.db',
});

module.exports = db;
