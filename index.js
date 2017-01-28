var modules=["https://api.thingspeak.com/channels/9556/feed.xml","https://api.thingspeak.com/channels/367346735/feed.xml"]
var activeModules=0;
$(document).ready(() => {
  setInterval(checkNetStatus, 500);
  for (var i = 0; i < modules.length; i++) {
    var client = new HttpClient();
    client.get(modules[i], function(response) {
    console.log(response);
    });
  }
  $(".well").hover(function(){
        $(this).css("background-color", "#4a4a55", "border-color", "#4a4a55");
        }, function(){
        $(this).css("background-color", "#35353d", "border-color", "#35353d");
    });
});
function checkNetStatus() {
  var online = navigator.onLine;
  if(online){
    $(".net-status").html("&nbsp;&nbsp;<i class=\"fa fa-globe\"></i> Connected");
  }
  else{
    $(".net-status").html("&nbsp;&nbsp;<i class=\"fa fa-globe\"></i> Not Connected");
  }
}
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}
