const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const catways = JSON.parse(fs.readFileSync(path.join(__dirname, './data/catways.json'), 'utf-8'));
    const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, './data/reservations.json'), 'utf-8'));


    await Catway.deleteMany();
    await Reservation.deleteMany();

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations.map(r => ({
      ...r,
      startDate: new Date(r.startDate),
      endDate: new Date(r.endDate),
    })));

    console.log('Import terminé');
    process.exit(0);
  } catch (e) {
    console.error('Import error:', e);
    process.exit(1);
  }
})();