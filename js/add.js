const {ipcRenderer} = require('electron')

$(document).ready(() => {
  $('#close').click(function () {
      ipcRenderer.send('toggle-add-window')
  })
  $('#add').click(function () {
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
      ipcRenderer.send('send-data', data)
      ipcRenderer.send('toggle-add-window')
  })
})
