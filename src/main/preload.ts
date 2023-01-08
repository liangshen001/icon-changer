import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'http-request' | 'http-response' | 'apps' | 'set-app-icon';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  close() {
    ipcRenderer.send('close-window');
  },
  getApps() {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('apps', (_event, apps) => {
        resolve(apps);
      });
      ipcRenderer.send('apps');
    });
  },
  getLocalIcons(appName: string) {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('local-icons', (_event, icons) => {
        resolve(icons);
      });
      ipcRenderer.send('local-icons', appName);
    });
  },
  changeAppIconFromIcnsUrl(appName: string, icnsUrl: string) {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('change-app-icon-from-icns-url', (_event, base64) => {
        resolve(base64);
      });
      ipcRenderer.send('change-app-icon-from-icns-url', appName, icnsUrl);
    });
  },
  changeAppIconFromIcnsName(appName: string, iconName: string) {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('change-app-icon-from-icns-name', (_event, base64) => {
        resolve(base64);
      });
      ipcRenderer.send('change-app-icon-from-icns-name', appName, iconName);
    });
  },
  changeAppIconFromBase64(appName: string, base64: string) {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('change-app-icon-from-base64', () => {
        resolve(undefined);
      });
      ipcRenderer.send('change-app-icon-from-base64', appName, base64);
    });
  },
});
