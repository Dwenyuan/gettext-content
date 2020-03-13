// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const { po } = require('gettext-parser')
const { translatorByBaidu } = require('./translator.services/translator.service')
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const menu = Menu.buildFromTemplate([{
    id: 1, label: 'File', submenu: [{
      id: 11, label: 'Open File', click: async () => {
        const { filePaths: [filePath] = [] } = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'po file', extensions: ['po', 'pot'] }] })

        const content = await fs.promises.readFile(filePath, { encoding: 'utf-8', flag: 'r+' })

        mainWindow.webContents.send('readed', po.parse(content))

      }
    }, { role: 'close' }]
  }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }])
  Menu.setApplicationMenu(menu)
  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  ipcMain.on('get-translation', (event, source) => {
    translatorByBaidu(source).then(res => {
      console.log('res', res);
      mainWindow.webContents.send('translated', res.data)
    }).catch(err => console.error('err', err))
  })
}
ipcMain.on('click', (event, message) => console.log(message))
ipcMain.on('open-directory', () => dialog.showOpenDialog({ properties: ['openDirectory'] }).then(files => console.log(files)))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
