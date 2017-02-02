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
  addPlants();
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

/*
 * Creates a new plant div and returns it
 */
function newPlant(name,id) {
  var plant = document.createElement('div');
  plant.className = "col-xs-6 col-lg-4";
  plant.innerHTML = '<div class="plant col-xs-12 col-lg-12 well" id="' + id + '" >\
    <div class="row">\
        <div class="col-xs-2 col-lg-2">\
           <br />\
           <i class="fa fa-tint" style="font-size: 5em;"></i>\
        </div>\
        <div class="info text-center col-xs-10 col-lg-10" id="info12">\
           <br />Name: ' + name + '<br />Moisture: 81%<br />Updated: 3 seconds ago<br /><br />\
        </div>\
    </div>\
  </div>';

  return plant;
}

/*
 * Test drive the newPlant() function
 */
function addPlants() {
    var plantList = document.getElementById("plantList");
    plantList.appendChild(newPlant("Banyan",0));
    plantList.appendChild(newPlant("Pine",1));
    plantList.appendChild(newPlant("Rosewood",2));
}
