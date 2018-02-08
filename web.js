var express = require('express')
var serveIndex = require('serve-index');
var app = express()
var Dal = require("./dal");
var sqlite3=require('sqlite3-promise')
var moment=require('moment')
var db = new sqlite3.Database('/share/chase.db');

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
 
app.listen(8080)

console.log(__dirname);
app.use('/', express.static('public/index.html'));
app.use(express.static('public'));