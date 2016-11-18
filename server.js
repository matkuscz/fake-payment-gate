const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Payment = require('./models/payment');

var PORT = 666;
var app = express();
mongoose.connect('mongodb://localhost/payments');

var paid_payment = {
  'merchant': 'merchant.com',
  'test': false,
  'price': 1000,
  'curr': 'CZK',
  'label': 'Beatles - Help !',
  'refId': 2010102600,
  'cat': 'DIGITAL',
  'method': 'MPAY_CZ',
  'email': 'info@sazky.cz',
  'phone': '+420123456789',
  'transId': 'AB12-EF34-IJ56',
  'secret': 'ZXhhbXBzSZ5gfd50654asdasdw',
  'status': 'PAID'
}

var transCounter = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.post('/createPayment', function (request, response) {
  transCounter++;

  var newPayment = new Payment({
    merchant: request.body.merchant,
    price: request.body.price,
    curr: request.body.curr,
    label: request.body.label,
    refId: request.body.refId,
    cat: request.body.cat,
    method: request.body.method,
    prepareOnly: request.body.prepareOnly,
    secret: request.body.secret,
    transId: transCounter
  });

  newPayment.save();
  console.log('Platba: %j', newPayment);

  var odpoved = {};

  odpoved.code = 0;
  odpoved.message = 'OK';
  odpoved.transId = newPayment.transId;
  odpoved.redirect = 'http://localhost:' + PORT + '/karta/' + newPayment.transId;

  console.log('Odpoved: %j', odpoved);

  response.send(odpoved);
});

app.get('/list', function (request, response) {
  response.json({
      yo: 'OK'
    });
});

app.get('/karta/:id', function (request, response) {
  Payment.find({transId: request.params.id}, function (sazky) {
    console.log('Prisel REQ: %j', request);

    console.log(sazky);

    response.json({
        yo: 'KARTA',
        text: 'Takova ta stranka s kartou, z ktery te to po kliku na buton presmeruje zpatky na tvuj web...',
        id: request.params.id,
      });
  });

});

app.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('==>   Aplikace: FAKE PAYMENT GATE startuje !!!');
        console.info("==>   Poslouchám na portu: %s.", PORT);
    }
});
