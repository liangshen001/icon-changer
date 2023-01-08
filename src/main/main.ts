/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import child_process from 'child_process';
import fs from 'fs';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

const tempPath = path.join(app.getPath('temp'), app.getName());
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath);
}

async function excuteFileiconScript(...args: string[]) {
  // const scriptPath = path.join(tempPath, 'fileicon.sh');
  // if (!fs.existsSync(scriptPath)) {
  //   fs.writeFileSync(scriptPath, fileiconContent, {
  //     mode: '777',
  //   });
  // }
  const scriptPath = getAssetPath('fileicon.sh');
  const script = child_process.spawn('bash', [scriptPath, ...args]);
  return new Promise((resolve, reject) => {
    script.stdout.on('data', (data) => {
      resolve(undefined);
      console.log(`stdout: ${data}`);
      log.log(`stdout: ${data}`);
    });

    script.stderr.on('data', (err) => {
      reject();
      console.log(`stderr: ${err}`);
      log.log(`stderr: ${err}`);
    });

    script.on('exit', (code) => {
      console.log(`Exit Code: ${code}`);
      log.log(`Exit Code: ${code}`);
    });
  });
}

ipcMain.on('close-window', async (event) => {
  mainWindow?.close();
  process.exit();
});

async function parseIcnsToBase64(icnsPath: string): Promise<string> {
  const imgPath = path.join(
    tempPath,
    `${Math.round(Math.random() * 1000000)}.png`
  );
  if (fs.existsSync(imgPath)) {
    fs.rmSync(imgPath);
  }
  const script = child_process.spawn('sips', [
    '-s',
    'format',
    'png',
    icnsPath,
    '-o',
    imgPath,
  ]);
  return new Promise((resolve, reject) => {
    script.stdout.on('data', (data) => {
      const base64 = fs.readFileSync(imgPath).toString('base64');
      fs.rmSync(imgPath);
      resolve(`data:image/png;base64,${base64}`);
      console.log(`stdout: ${data}`);
      log.log(`stdout: ${data}`);
    });

    script.stderr.on('data', (err) => {
      reject();
      console.log(`err: ${err}`);
      log.log(`err: ${err}`);
    });

    script.on('exit', (code) => {
      console.log(`exit: ${code}`);
      log.log(`exit: ${code}`);
    });
  });
}

async function getAppPngBase64(appName: string): Promise<string> {
  const url = path.join(tempPath, `${appName}.icns`);
  if (fs.existsSync(url)) {
    fs.rmSync(url);
  }
  try {
    await excuteFileiconScript(
      'get',
      '-f',
      `/Applications/${appName}.app`,
      url
    );
    const base64 = await parseIcnsToBase64(url);
    fs.rmSync(url);
    return base64;
  } catch (e) {
    const files = fs.readdirSync(
      `/Applications/${appName}.app/Contents/Resources`
    );
    const icnsName = files.find((i) => i.endsWith('icns'));
    const base64 = await parseIcnsToBase64(
      `/Applications/${appName}.app/Contents/Resources/${icnsName}`
    );
    return base64;
  }
}

ipcMain.on('apps', async (event, arg) => {
  const dirs = fs.readdirSync('/Applications');
  const apps = await Promise.all(
    dirs
      .filter((i) => i.endsWith('.app'))
      .map(async (i) => {
        const appName = i.slice(0, -4);
        const localUrl = await getAppPngBase64(appName);
        return {
          src: localUrl,
          name: appName,
        };
      })
  );
  event.reply('apps', apps);
});

async function download(url: string): Promise<string> {
  mainWindow!.webContents.downloadURL(url);
  return new Promise((resolve, reject) => {
    mainWindow!.webContents.session.once(
      'will-download',
      (event, item, webContents) => {
        const file = path.join(tempPath, item.getFilename());
        // 设置文件存放位置
        item.setSavePath(file);
        item.on('updated', (event2, state) => {
          if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed');
            log.log('Download is interrupted but can be resumed');
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused');
              log.log('Download is paused');
            } else {
              console.log(`Received bytes: ${item.getReceivedBytes()}`);
              log.log(`Received bytes: ${item.getReceivedBytes()}`);
            }
          }
        });
        item.once('done', (event2, state) => {
          if (state === 'completed') {
            console.log('Download successfully');
            log.log('Download successfully');
            resolve(file);
          } else {
            reject();
            console.log(`Download failed: ${state}`);
            log.log(`Download failed: ${state}`);
          }
        });
      }
    );
  });
}

async function iconChange(appName: string, iconPath: string) {
  await excuteFileiconScript('set', `/Applications/${appName}.app`, iconPath);
}
ipcMain.on('change-app-icon-from-icns-url', async (event, appName, icnsUrl) => {
  console.log(icnsUrl);
  const url = await download(icnsUrl);
  console.log(url);
  await iconChange(appName, url);
  const base64 = await parseIcnsToBase64(url);
  event.reply('change-app-icon-from-icns-url', base64);
});
ipcMain.on(
  'change-app-icon-from-icns-name',
  async (event, appName, icnsName) => {
    const icnsPath = `/Applications/${appName}.app/Contents/Resources/${icnsName}`;
    await iconChange(appName, icnsPath);
    const base64 = await parseIcnsToBase64(icnsPath);
    event.reply('change-app-icon-from-icns-name', base64);
  }
);
ipcMain.on('change-app-icon-from-base64', async (event, appName, base64) => {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = Buffer.from(base64Data, 'base64');
  const iconPath = path.join(tempPath, `${Math.round(Math.random() * 10000)}`);
  fs.writeFileSync(iconPath, dataBuffer);
  await iconChange(appName, iconPath);
  fs.rmSync(iconPath);
  event.reply('change-app-icon-from-base64');
});
ipcMain.on('local-icons', async (event, appName) => {
  const files = fs.readdirSync(
    `/Applications/${appName}.app/Contents/Resources`
  );
  const icons = await Promise.all(
    files
      .filter((i) => i.endsWith('icns'))
      .map(async (i) => ({
        src: await parseIcnsToBase64(
          `/Applications/${appName}.app/Contents/Resources/${i}`
        ),
        name: i,
      }))
  );
  event.reply('local-icons', icons);
});
