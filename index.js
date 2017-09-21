const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const app = electron.app
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const dialog = electron.dialog

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    show:false,
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      javascript: true,
      plugins: true,
      webSecurity: false,
    }
  })
  win.once('ready-to-show', () => {
    win.show()
  })
  // 加载应用的 index.html。
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开开发者工具。
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)
app.on('ready', function () {
  ipc.on('open-image', function (event) {
    const options = {
      title: '打开图像',
      defaultPath: path.join(__dirname),
      filters: [
        { name: 'Images', extensions: ['png','jpg'] }
      ],
      properties: [
        "openFile"
      ]
    }
    dialog.showOpenDialog(options, function (filename) {
      event.sender.send('opened-image', filename)
    })
  })
  ipc.on('save-image', function (event) {
    const options = {
      title: '保存图像',
      defaultPath: path.join(__dirname, 'image.png'),
      filters: [
        { name: 'Images', extensions: ['png','jpg'] }
      ]
    }
    dialog.showSaveDialog(options, function (filename) {
      event.sender.send('saved-image', filename)
    })
  })
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在这文件，你可以续写应用剩下主进程代码。
  // 也可以拆分成几个文件，然后用 require 导入。
  if (win === null) {
    createWindow()
  }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
// ipc.on("save-file-dialog", function (e) {
//   dialog.showSaveDialog({
//     filters: [
//       {name: 'Images', extensions: ['jpg', 'png']},
//     ]
//   }, function (files) {
//     if (files) {
//       event.sender.send("selected-directory", files);
//     }
//   })
// })

// function save() {
//   dialog.showSaveDialog({
//     filters: [
//       {name: 'Images', extensions: ['jpg', 'png']},
//     ]
//   }, function (files) {
//     if (files) {
//       alert("Selected!");
//     }
//   })
// }

//Save
//document.getElementById("save").addEventListener("click", save());