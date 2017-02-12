const {ipcRenderer} = require('electron')
$(document).ready(() => {
  $('#close').click(function () {
      ipcRenderer.send('toggle-add-window')
  })
  $('#send').click(function () {
      ipcRenderer.send('send-data', 'hi!')
  })
})
