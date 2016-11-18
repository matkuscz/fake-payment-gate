const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var paymentSchema = mongoose.Schema({
  merchant    : String,
  price       : Number,
  curr        : String,
  label       : String,
  refId       : String,
  cat         : String,
  method      : String,
  prepareOnly : Boolean,
  secret      : String,
  transId     : String,
});

module.exports = mongoose.model('Payment', paymentSchema);
