const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var merchantSchema = mongoose.Schema({
  name              : String,
  successRedirect   : String,
  failedRedirect    : String,
  unknownRedirect   : String,
  secret            : String,
});

module.exports = mongoose.model('Merchant', merchantSchema);
