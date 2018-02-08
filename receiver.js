var SX127x = require('sx127x');
var LoraMessage = require("./loraMesssage");
var Dal = require("./dal");
var sqlite3=require('sqlite3-promise')
//var moment=require('moment')
var db = new sqlite3.Database('/share/chase.db');

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  //spreadingFactor: 12
});


let dal = new Dal(db);
var count = 0;

// open the device
sx127x.open(function(err) {
  console.log('open', err ? err : 'success');

  if (err) {
    throw err;
  }

  // add a event listener for data events
  sx127x.on('data', async function(buf, rssi, snr) {
    var lm = new LoraMessage();
    lm.fromBuffer(buf)

    await dal.createLoraMessageTableAsync();
    await dal.insertLoraMessageAsync(lm, rssi, snr);

    var message = await dal.getLatestLoraMessageAsync();
    console.log(message);
  });

  // enable receive mode
  sx127x.receive(function(err) {
    console.log('receive', err ? err : 'success');
  });
});

process.on('SIGINT', function() {
  // close the device
  sx127x.close(function(err) {
    console.log('close', err ? err : 'success');
    process.exit();
  });
});
