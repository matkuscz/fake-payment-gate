const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var randomString = require('./utils/randomString');
var writeRequest = require('./utils/writeRequest');

var Payment = require('./models/payment');
var Merchant = require('./models/merchant');


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

app.set('view engine', 'ejs');
app.set('views', './views');

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
    transId: transCounter,
    state: 'new'
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
  Payment.find({}, '', function (err, payments) {
    if(err) {
      throw err;
    }

    console.log("Payments: %j", payments);

    response.render('list.ejs', {
      payments: payments,
    });
  })
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

app.post('/createMerchant', function (request, response) {
  var merchant = new Merchant({
    'name': request.body.name,
    'successRedirect': request.body.successRedirect,
    'failedRedirect': request.body.failedRedirect,
    'unknownRedirect': request.body.unknownRedirect,
    'secret': randomString(),
    'state': "new",
  });

  console.log("New merchant: %j", merchant);

  merchant.save();

  response.json({
    secret: merchant.secret,
  });
});

app.post('/pay', function (request, response) {

  var merchant = new Merchant({
    'name': request.body.name,
    'successRedirect': request.body.successRedirect,
    'failedRedirect': request.body.failedRedirect,
    'unknownRedirect': request.body.unknownRedirect,
    'secret': randomString(),
  });

  console.log("New merchant: %j", merchant);

  merchant.save();

  response.json({
    secret: merchant.secret,
  });
});

app.get('/pay/:transId', function (request, response) {
  var data = {};

  console.log('Data', data);
  console.log('Trans: %j', request.params.transId);

  Payment.findOne(
    {
      transId: request.params.transId,
    },
    'merchant price curr label refId cat method ',
    function (err, payment) {
      if(err) {
        throw(err);
      }

      data.payment = payment;

      console.log('Payment', payment);
      console.log('Data after payment', data);



      response.render('pay.ejs', {
        merchant: data.payment.merchant,
        price: data.payment.price,
        curr: data.payment.curr,
        label: data.payment.label,
        refId: data.payment.refId,
        cat: data.payment.cat,
        method: data.payment.method,
      });

      // response.json({
      //   'Msg': 'OK'
      // });
  });
  // var merchant = Merchant.findOne({
  //   name: data.payment.merchant,
  //   secret: data.payment.secret,
  //   },
  //   'name successRedirect failedRedirect unknownRedirect',
  //   function (err, merchant) {
  //     if(err) throw(err);
  //     data.merchantName = merchant;
  //   }
  // );
});

app.get('/decide/:transId-:action', function (request, response) {
  var successRedirect;
  var failedRedirect;
  var unknownRedirect;
  var payment;

  Payment.findOne(
    {
      transId: request.params.transId,
    },
    'merchant price curr label refId cat method',
    function (err, payment) {
      if(err) {
        throw(err);
      }
      if(request.params.action === 'success') {
        payment.status = 'success';
        payment.save();

        Merchant.findOne({
          name: payment.merchant
        }, 'successRedirect failedRedirect unknownRedirect',
        function (err, merchant) {
          if(err) { throw err; }
            response.json({
              'successRedirect': merchant.successRedirect + '?refID=' + payment.refId,
              'failedRedirect': merchant.failedRedirect + '?refID=' + payment.refId,
              'unknownRedirect': merchant.unknownRedirect + '?refID=' + payment.refId,
            });
        });

      } else if(request.params.action === 'failed') {
        payment.status = 'failed';
        payment.save();

        Merchant.findOne({
          name: payment.merchant
        }, 'failedRedirect',
        function (err, merchant) {
          if(err) { throw err; }
            response.json({
              'successRedirect': merchant.successRedirect + '?refID=' + payment.refId,
              'failedRedirect': merchant.failedRedirect + '?refID=' + payment.refId,
              'unknownRedirect': merchant.unknownRedirect + '?refID=' + payment.refId,
            });
        });
      } else if(request.params.action === 'unknown') {
        payment.status = 'unknown';
        payment.save();

        Merchant.findOne({
          name: payment.merchant
        }, 'unknownRedirect',
        function (err, merchant) {
          if(err) { throw err; }
            response.json({
              'successRedirect': merchant.successRedirect + '?refID=' + payment.refId,
              'failedRedirect': merchant.failedRedirect + '?refID=' + payment.refId,
              'unknownRedirect': merchant.unknownRedirect + '?refID=' + payment.refId,
            });
        });
      }
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
