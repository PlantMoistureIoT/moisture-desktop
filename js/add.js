const {ipcRenderer} = require('electron')
$(document).ready(() => {
  $('#close').click(function () {
      ipcRenderer.send('toggle-add-window')
  })
})
