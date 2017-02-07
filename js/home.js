const storage = require('electron-json-storage')
const {BrowserWindow} = require('electron').remote
const {ipcRenderer} = require('electron')
const path = require('path')
const url = require('url')

var modules = []
var modules_index;

function Plant(name,moisture,channel,lastUpdated) {
    this.name = name;
    this.moisture = moisture;
    this.channel = channel;
    this.lastUpdated = lastUpdated;
}

$(document).ready(() => {
  setInterval(checkNetStatus, 1000);

  readStorage();

  addPlants();

  $(".well").hover(function () {
    $(this).css("background-color", "#4a4a55", "border-color", "#4a4a55");
    }, function(){
    $(this).css("background-color", "#35353d", "border-color", "#35353d");
    });

  $("#addBtn").click(() => {
    $(".addIcon").addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function(){
      $(this).removeClass('animated pulse');
    });
    ipcRenderer.send('toggle-add-window')//Send visibilty toggle request to main process
  });

  $(".well").click(function () {
    $(this).addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function(){
      $(this).removeClass('animated pulse');
    });
  });

  $(".plant").click(() => {
    //Creates a new window for the graphs
    var graphWindow = new BrowserWindow({width: 450, height: 280, show: false})
    graphWindow.loadURL('https://thingspeak.com/channels/218909/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15')
    graphWindow.once('ready-to-show', () => {
      graphWindow.show()
    })
  });
});

/*
 * Writes the current ThingSpeak in
 * the modules array to a local json
 * file called 'modules.json'. All changes
 * are overwritten after each call.
 */
function writeStorage() {
  console.log("Writing : " + modules);
  storage.set('modules.json', modules, function(error) {
    if (error)
      throw error;
  });
}

/*
 * Reads the ThingSpeak channels
 * from a local json file called
 * 'modules.json'
 */
function readStorage() {
  storage.get('modules.json', function(error, data) {
    if (error)
      throw error;
    modules = data;
    console.log("Read : " + modules);

    /* Fetch values from ThingSpeak only after
     * reading the local file and inflating the modules array
     */
    modules_index = 0;
    for(var i = 0 ; i < modules.length ; ++i) {
      $.getJSON('https://thingspeak.com/channels/'+ modules[i].channel +
        '/feed.json',updateModules);
    }
  });
}

/*
 * Fetches the most recent  non null
 * reading from the ThingSpeak Channel(s)
 */
function updateModules(data,status) {
    var i;
    if(status != "success") {
        console.log(status);
        return;
    }

    for(i = data.feeds.length - 1; i >= 0 ; --i) {
        if(data.feeds[i].field1 != null) {
            modules[modules_index].moisture = data.feeds[i].field1;
            modules[modules_index].lastUpdated = getDateDiff(data.feeds[i].created_at);
            break;
        }
    }
    ++modules_index; // Update the global variable modules_index
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
  plant.innerHTML = '<div class="col-xs-12 col-lg-12 well plant" id="' + id + '" >\
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

/* Parses the passed ISO date and returns the difference
 * between the current time and the date parameter
 */
 function getDateDiff(created_at) {
   var date = new Date(created_at);
   var diff = new Date() - date;
   var x = Math.trunc(diff / 1000);
   var seconds = x % 60;
   x = Math.trunc(x/60);
   var minutes = x % 60;
   x = Math.trunc(x/60);
   var hours = x % 24;
   x = Math.trunc(x/24);
   var days = x;

   var str = '';
   if(days > 0) {
       str += days + " days ";
   }
   if(hours > 0) {
       str += hours + " hours ";
   }
   if(minutes > 0) {
       str += minutes + " mins ";
   }
   if(seconds > 0 && minutes <= 0 && hours <= 0 && days <= 0) {
       str += seconds + " seconds ";
   }

   str += "ago";
   return str;
 }
