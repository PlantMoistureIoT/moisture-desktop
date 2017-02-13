const {ipcRenderer} = require('electron')
$(document).ready(() => {
  $('#close').click(function () {
      ipcRenderer.send('toggle-add-window')
  })
  $('#add').click(function () {
      ipcRenderer.send('send-data', 'hi!')
      ipcRenderer.send('toggle-add-window')
  })
})
