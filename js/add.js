const {ipcRenderer} = require('electron')
const storage = require('electron-json-storage')

var modules = [];

setInterval(readLoop, 500);
function readLoop() {
  storage.get('modules.json', function(error, data) {
    if (error)
      throw error;

      modules = data;
      if(modules.length == undefined)
        modules = [];
    });
}


$(document).ready(() => {
  $('#close').click(function () {
      ipcRenderer.send('toggle-add-window')
  })
  $('#add').click(function () {
      console.log(modules);
      var name_input = document.getElementById("name_id");
      var channel_input = document.getElementById("channel_id");
      var data = {};
      data.name = name_input.value;
      if(data.name.length==0) {
          alert("Please enter a valid name!");
          return;
      }
      data.channel = channel_input.value;
      if(data.channel.length==0) {
          alert("Please enter a valid channel ID!");
          return;
      }
      for(var i = 0 ; i < data.channel.length; ++i) {
          if(!(data.channel.charAt(i)>='0' && data.channel.charAt(i)<='9')) {
              alert("Please enter a valid channel ID!");
              return;
          }
      }
      for(var i = 0 ; i < modules.length; ++i){
          if(data.channel == modules[i].channel) {
              alert("An entry with this channel already exists!");
              return;
          }
      }
      ipcRenderer.send('send-data', data)
      ipcRenderer.send('toggle-add-window')
  })
})
