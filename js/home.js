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
  setInterval(updateUI,5000);

  readStorage();



  $("#addBtn").click(() => {
    $(".addIcon").addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function(){
      $(this).removeClass('animated pulse');
    });
    ipcRenderer.send('toggle-add-window')//Send visibilty toggle request to main process
  });


  ipcRenderer.on('sending-data', (event, data) => {
    modules.push(data);
    addPlantUI(data,modules.length-1);
    writeStorage();
  })
});

/* Update moisture and last updated values
 * which are displayed on the screen
 */
function updateUI() {
    if(modules.length==0)
        return;
    console.log("UPDATING MODULES");
    updateModules();
    for(var i = 0 ; i < modules.length ; ++i) {
          var moisture_i = document.getElementById("moisture_"+i);
          moisture_i.innerHTML = 'Moisture: ' + modules[i].moisture + '% <br />';

          var lastUpdated_i = document.getElementById("lastUpdated_"+i);
          lastUpdated_i.innerHTML = 'Updated: ' + modules[i].lastUpdated + '<br /><br />'
    }
    writeStorage();
}

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
    if(modules.length == undefined)
        modules = [];

    /* Fetch values from ThingSpeak only after
     * reading the local file and inflating the modules array
     */
    updateModules();
    addAllPlants();
  });
}

function updateModules() {
    modules_index = 0;
    for(var i = 0 ; i < modules.length ; ++i) {
    $.getJSON('https://thingspeak.com/channels/'+ modules[i].channel +
      '/feed.json',updateModules_callback);
  }
}

/*
 * Fetches the most recent  non null
 * reading from the ThingSpeak Channel(s)
 */
function updateModules_callback(data,status) {
    var i;
    if(status != "success") {
        console.log(status);
        return;
    }

    for(i = data.feeds.length - 1; i >= 0 ; --i) {
        if(data.feeds[i].field1 != null && modules[modules_index]!=null) {
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
function newPlant(module_i,id) {
  var plant = document.createElement('div');
  plant.className = "col-xs-6 col-lg-4";
  plant.innerHTML = '<div onclick="openGraph(' + module_i.channel + ')" class="col-xs-12 col-lg-12 well plant" id="' + id + '" >\
    <div class="row">\
        <div class="col-xs-2 col-lg-2">\
           <br />\
           <i class="fa fa-tint" style="font-size: 5em;"></i>\
        </div>\
        <div class="info text-center col-xs-10 col-lg-10" id="info12">\
           <div><br />Name: ' + module_i.name + '<br /></div>\
           <div id="moisture_' + id + '">Moisture: ' + module_i.moisture + '% <br /></div>\
           <div id="lastUpdated_' + id + '">Updated: ' + module_i.lastUpdated + '<br /><br /></div>\
        </div>\
    </div>\
  </div>';

  return plant;
}

/* Add the parameter to the UI, just
 * before the Add Button block
 */
function addPlantUI(module_i,index){
  var plantList = document.getElementById("plantList");
  var addBtn = document.getElementById("addBtn");
  plantList.insertBefore(newPlant(module_i,index),addBtn);
  $(".well").hover(function () {
    $(this).css("background-color", "#4a4a55", "border-color", "#4a4a55");
    }, function(){
    $(this).css("background-color", "#35353d", "border-color", "#35353d");
    });

  $(".well").click(function () {
      $(this).addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
      function(){
        $(this).removeClass('animated pulse');
      });
    });

}

/*
 * Add plants currently in 'modules' to the UI
 */
function addAllPlants() {
    console.log(modules);
    for(var i = 0 ; i < modules.length ; ++i) {
        addPlantUI(modules[i],i);
    }
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

 function openGraph(channel) {
   if(navigator.onLine){
     var graphWindow = new BrowserWindow({width: 450, height: 280, show: false})
     var URL = 'https://thingspeak.com/channels/' + channel +
     '/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15';
     graphWindow.loadURL(URL);
     graphWindow.setMenu(null);
     graphWindow.once('ready-to-show', () => {
       graphWindow.show()
     })
   }
   else{
     var errWindow = new BrowserWindow({width:400, height: 280, show: false})
      errWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../windows/404.html'),
        protocol: 'file:',
        slashes: true
      }))
      errWindow.once('ready-to-show', () => {
        errWindow.show()
      })
   }
 }
