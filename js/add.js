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
      data.channel = channel_input.value;
      ipcRenderer.send('send-data', data)
      ipcRenderer.send('toggle-add-window')
  })
})
