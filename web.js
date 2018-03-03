var express = require('express')
var serveIndex = require('serve-index');
var app = express()
var Dal = require("./dal");
var sqlite3=require('sqlite3-promise')
var moment=require('moment')
var db = new sqlite3.Database('/share/chase.db');

var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('/share/server-key.pem'),
  cert: fs.readFileSync('/share/server-cert.pem')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);


function first(arr){
  if(arr == null || arr.length == 0)
    return null;
  return arr[0];
}

moment.updateLocale('en', {
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s  : '%d seconds',
      ss : '%d seconds',
      m:  "%d minutes",
      mm: "%d minutes",
      h:  "%d hour(s)",
      hh: "%d hour(s)",
      d:  "a day",
      dd: "%d days",
      M:  "a month",
      MM: "%d months",
      y:  "a year",
      yy: "%d years"
  }
});

app.get('/data', async (req, res) => {    
  var data = {}
  let dal = new Dal(db);
  data.LatestMessage = await dal.getLatestLoraMessageAsync();

  //Hack
  if(data.LatestMessage != null && data.LatestMessage.ReceivedDate != null) {
    data.LatestMessage.ReceivedDate = moment(data.LatestMessage.ReceivedDate).fromNow()
  }
  res.send(data);
})

app.get('/mapData', async (req, res) => {    
  let dal = new Dal(db);
  var id = req.query.id
  var data = await dal.getAllLoraMessagesAsync(id);
  res.send(data);
})

app.get('/emptydatabase', async (req, res) => {    
  let dal = new Dal(db);
  console.log('Empty Database')
  await dal.emptyDatabaseAsync();
  console.log('Get Lastest Message')
  var message = await dal.getLatestLoraMessageAsync();
  console.log(message);
  res.send("Done");
})
 
app.get('/reboot', async (req, res) => {    
  console.log('Reboot')
  require('child_process').exec('sudo shutdown -r now', console.log)
  res.send("Done");
})
 
app.get('/shutdown', async (req, res) => {    
  console.log('Shutdown')
  require('child_process').exec('sudo shutdown -h now', console.log)
  res.send("Done");
})
 
//console.log(__dirname);
//app.use('/', express.static('public/index'));

app.get('/', function(req, res) {
  res.render('index', {title:"Main"});
});

app.get('/map', function(req, res) {
  res.render('map', {title:"Map"});
});

app.get('/charts', function(req, res) {
  res.render('charts', {title:"Charts"});
});

app.get('/admin', function(req, res) {
  res.render('admin', {title:"Admin"});
});

app.use(express.static('public'));
app.use('/map', express.static('/share/map/'));
app.use('/scripts', express.static(__dirname + '/node_modules/leaflet/dist/'));

app.use('/chase.db', express.static('/share/chase.db'));


app.locals.scripts = [];
app.locals.addScripts=function (all) {
app.locals.scripts = [];
    if (all != undefined) {
        app.locals.scripts =  all.map(function(script) {
            return "<script src='/" + script + "'></script>";
        }).join('\n ');
    }

};
app.locals.getScripts = function(req, res) {
    return app.locals.scripts;
};

sendChartAsync = async (res, col1, dateColumn, table) => {
  var script = "SELECT " + col1  + " AS a, " + dateColumn + " AS b FROM " + table + " ORDER BY " + dateColumn;
  var data = await db.allAsync(script);
  var toReturn = [];
  data.forEach(element => {
    toReturn.push([moment(element.b).unix() * 1000, Number(element.a)]);
  });
  res.send(toReturn);
}

app.get('/gpsAltitude', async (req, res) => {    
  await sendChartAsync(res ,"(MslCurrentAltitudeMeters  * 3.28084)", "ReceivedDate", "LoraMessage");
})
 
app.get('/altitude', async (req, res) => {    
  await sendChartAsync(res ,"(CurrentAltitudeMeters * 3.28084)", "ReceivedDate", "LoraMessage");
})
 
app.get('/internalTemp', async (req, res) => {    
  await sendChartAsync(res ,"InternalTemperatureInFahrenheit", "ReceivedDate", "LoraMessage");
})

app.get('/externalTemp', async (req, res) => {    
  await sendChartAsync(res ,"ExternalTemperatureInFahrenheit", "ReceivedDate", "LoraMessage");
})

app.get('/cellSignalStrength', async (req, res) => {    
  await sendChartAsync(res ,"StrengthInDecibel", "ReceivedDate", "LoraMessage");
})

app.get('/battery', async (req, res) => {    
  await sendChartAsync(res ,"BatteryPercentFull", "ReceivedDate", "LoraMessage");
})

app.get('/speed', async (req, res) => {    
  await sendChartAsync(res ,"(SpeedOverGroundInKilometersPerHour * 0.621371)", "ReceivedDate", "LoraMessage");
})

app.get('/rssi', async (req, res) => {    
  await sendChartAsync(res ,"Rssi", "ReceivedDate", "LoraMessage");
})

app.get('/snr', async (req, res) => {    
  await sendChartAsync(res ,"Snr", "ReceivedDate", "LoraMessage");
})