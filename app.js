const {app, BrowserWindow,Menu,ipcMain} = require('electron')
const path = require('path')
const url = require('url')

process.env.NODE_EV=='production';
let addWindow;
let mainWindow;

app.on('ready',function(){
    mainWindow=new BrowserWindow({});


      // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  //Quit Window

  mainWindow.on('closed',function(){
      app.quit();
  })

  const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
})

function createAddWindow()
{
    addWindow=new BrowserWindow({width: 300, height: 200,title:'Add Task'});


    // and load the index.html of the app.
addWindow.loadURL(url.format({
  pathname: path.join(__dirname, 'addWindow.html'),
  protocol: 'file:',
  slashes: true
}))

//Garbage collection

addWindow.on('close',function(){
    addWindow=null;
})
}

ipcMain.on('item:add',function(e,item){
    console.log(item);
mainWindow.webContents.send('item:add',item);
addWindow.close();
})


const mainMenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
        
            },{
                label:'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },{
                label:'Quit',
                accelerator:process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//If on mac,add empty object to menu

if(process.platform == 'darwin')
{
    mainMenuTemplate.unshift({});
}

//Add Dev tools

if(process.env.NODE_EV !== 'production')
{
    mainMenuTemplate.push({
        label:'Dev Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}


