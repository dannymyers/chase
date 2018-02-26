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

app.get('/data', async (req, res) => {    
  var data = {}
  let dal = new Dal(db);
  data.LatestMessage = await dal.getLatestLoraMessageAsync();
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

app.get('/admin', function(req, res) {
  res.render('admin', {title:"Admin"});
});

app.use(express.static('public'));
app.use('/map', express.static('/share/map/'));
app.use('/scripts', express.static(__dirname + '/node_modules/leaflet/dist/'));

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