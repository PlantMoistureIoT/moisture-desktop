var modules=['https://thingspeak.com/channels/218909/feed.json']
var activeModules=0;
$(document).ready(() => {
  setInterval(checkNetStatus, 1000);

  for(var i = 0 ; i < modules.length ; ++i) {
    $.getJSON(modules[i],readMoisture);
  }

  addPlants();

  $(".well").hover(function(){
        $(this).css("background-color", "#4a4a55", "border-color", "#4a4a55");
        }, function(){
        $(this).css("background-color", "#35353d", "border-color", "#35353d");
    });

  $("#addBtn").click(() => {
    $(".addIcon").addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function(){
      $(this).removeClass('animated pulse');
    });
  });
});

/*
 * Fetches the most recent  non null
 * reading from the ThingSpeak Channel(s)
 */
function readMoisture(data,status) {
    var i;
    if(status != "success") {
        console.log(status);
        return;
    }
    for(i = data.feeds.length - 1; i >= 0 ; --i) {
        if(data.feeds[i].field1 != null) {
            console.log("Channel : " + data.channel.id);
            console.log("Most recent value : " + data.feeds[i].field1);
            break;
        }
    }
}
function checkNetStatus() {
  var online = navigator.onLine;
  if(online){
    $(".net-status").html("&nbsp;&nbsp;<i class=\"fa fa-globe\"></i> Connected");
  }
  else{
    $(".net-status").html("&nbsp;&nbsp;<i class=\"fa fa-globe\"></i> Not Connected");
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
    var addBtn = document.getElementById("addBtn");
    plantList.insertBefore(newPlant("Banyan",0),addBtn);
    plantList.insertBefore(newPlant("Pine",1),addBtn);
    plantList.insertBefore(newPlant("Rosewood",2),addBtn);
}
