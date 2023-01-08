import {
  Window,
  TitleBar,
  SearchField,
  Toolbar,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '@liangshen/react-desktop/macOs';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import * as React from 'react';
import Grid, { Item } from '../components/IconList/Grid';
import AppModal from '../components/AppModal/AppModal';

const Home: FC = () => {
  const [apps, setApps] = useState<Item[]>([]);
  const [filterApps, setFilterApps] = useState<Item[]>([]);
  const [selectedApp, setSelectedApp] = useState<Item>();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const getApps = () => {
    setLoading(true);
    window.electron
      .getApps()
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch(() => {
        setApps([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getApps();
  }, []);

  useEffect(() => {
    if (apps) {
      setFilterApps(
        searchValue ? apps.filter((i) => i.name.includes(searchValue)) : apps
      );
    }
  }, [searchValue, apps]);

  const refresh = (appName: string, base64: string) => {
    setApps(
      apps.map((i) => ({
        name: i.name,
        src: i.name === appName ? base64 : i.src,
      }))
    );
  };

  return (
    <>
      <Window chrome padding="0px" overflow="auto">
        <TitleBar
          title={
            <div style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10 }}>
              Icon Changer
            </div>
          }
          onCloseClick={() => window.electron.close()}
          inset
          controls
          height="55px"
          style={{ minHeight: '55px' }}
        >
          <Toolbar horizontalAlignment="right">
            <SearchField
              placeholder="Search"
              defaultValue={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
            />
          </Toolbar>
        </TitleBar>
        <Grid
          items={filterApps}
          padding="10px"
          loading={loading}
          onClickItem={(app) => setSelectedApp(app)}
        />
      </Window>
      <AppModal
        app={selectedApp}
        onCancel={() => setSelectedApp(undefined)}
        refresh={refresh}
      />
    </>
  );
};
export default Home;
