const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = new mongoose.Schema({
  dex_number: {type: Number, sparse: true},
  name:    String,
  dex_no:   Number,
  types:     String,
  sprite:   String,
  abilities: String,
  catch_date:     { type: Date, default: Date.now},
}, {versionKey: false});

const trainerSchema = new mongoose.Schema({
  trainerID: {type: Number, index: {unique: true}},
  username:  String,
  dex_progress:   { type: Number, default: 0},
  join_date:   { type: Date, default: Date.now},
  pokemon: [pokemonSchema],
}, {versionKey: false});


const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;

