const { app, BrowserWindow, ipcMain, protocol } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')

require('@electron/remote/main').initialize()
require('update-electron-app')({
  repo: 'github-user/repo',
  updateInterval: '1 hour',
  logger: require('electron-log')
})

let win; 
function createWindow() {
  // Create the browser window.
  protocol.registerFileProtocol(
    'fileprotocol',
    fileHandler,
  );
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true, 
      webSecurity: true,
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  return win;
 
}
function fileHandler(req, callback){
  let requestedPath = req.url
  // Write some code to resolve path, calculate absolute path etc
  let check = true // Write some code here to check if you should return the file to renderer process

  if (!check){
    callback({
      // -6 is FILE_NOT_FOUND
      // https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h
      error: -6 
    });
    return;
  }

  callback({
    path: requestedPath
  });
}


app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    win = createWindow()
  }
})

//렌더러프로세스에서 보내는 메시지 처리
ipcMain.on('toggle-debug', (event, arg)=> {
  //디버기 툴 토글(on/off)
  alert("aa")
  win.webContents.toggleDevTools()
})
ipcMain.on('refresh', (event, arg)=> {
  //페이지 갱신
  win.reload();
})
