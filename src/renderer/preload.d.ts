import { Channels } from 'main/preload';
import { Item } from './components/IconList/Grid';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
      close: () => void;
      getApps: () => Promise<Item[]>;
      getLocalIcons: (appName: string) => Promise<Item[]>;
      changeAppIconFromIcnsUrl: (
        appName: string,
        icnsUrl: string
      ) => Promise<string>;
      changeAppIconFromIcnsName: (
        appName: string,
        icnsName: string
      ) => Promise<string>;
      changeAppIconFromBase64: (
        appName: string,
        base64: string
      ) => Promise<void>;
    };
  }
}

export {};
