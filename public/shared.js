function playSoundOrVibrate() {
  try {
    navigator.vibrate(100);
  }
  catch(e) {
  }
  try {
    new Audio('./message.mp3').play() 
  }
  catch(e) {
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}