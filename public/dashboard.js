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

var myData = {    
  Data: {
  }
}

var vm = new Vue({
  el: '#app',
  data: myData,
  filters: {
    moment: function (date) {
      //      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
      return moment(date).fromNow();
    }
  },
  created: function() {

    getData = ()=> {
      httpGetAsync("/data", (result)=>{
        var newData = JSON.parse(result);
        if(myData.Data.LatestMessage == null || myData.Data.LatestMessage.Count != newData.LatestMessage.Count)
          new Audio('./message.mp3').play()
        myData.Data = newData;
      });
    }
    window.setInterval(()=>
    {
      getData();
    }, 1000);
    getData();

  }
});