const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path')
const url = require('url')
const {ipcMain} = electron;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1366, height: 768, show: false})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/windows/home.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.once('ready-to-show', () => {
    win.show()
  })
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

//Create plant addition window
app.on('ready', function() {
  createWindow()

  //Toggle plant addition window visibilty on request
  ipcMain.on('toggle-add-window', function() {
    try {
      if(!addWindow.isVisible()){
        addWindow.show();
      }
      else{
        addWindow.hide();
      }
    } catch (e) {
      var addWindow = new BrowserWindow({width:400, height: 400, show: false, center: true, alwaysOnTop: true})
      addWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/windows/add.html'),
        protocol: 'file:',
        slashes: true
      }))
      addWindow.setMenu(null)
      addWindow.once('ready-to-show', () => {
        addWindow.show()
      })
    }
  })
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
