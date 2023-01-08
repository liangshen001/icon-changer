// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SearchField } from '@liangshen/react-desktop/macOs';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { getMacOSIcons } from '../../api';
import Grid, { Item } from '../IconList/Grid';
import './MacOSIconList.css';

export interface MacOSIconListProps {
  appName: string;
  refresh: (base64: string) => void;
}

const MacOSIconList: FC<MacOSIconListProps> = (props) => {
  const { appName, refresh } = props;
  const [icons, setIcons] = useState<Item[]>();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>();

  useEffect(() => {
    if (searchText !== undefined) {
      setIcons([]);
      setLoading(true);
      getMacOSIcons(searchText)
        .then((data) => {
          setIcons(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [searchText]);

  useEffect(() => {
    if (appName) {
      setSearchText(appName);
    } else {
      setIcons([]);
      setLoading(false);
    }
  }, [appName]);

  const setAppIcon = (icon: any) => {
    setLoading(true);
    window.electron
      .changeAppIconFromIcnsUrl(appName, icon.icnsUrl)
      .then((base64) => {
        setLoading(false);
        refresh(base64);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="macos-icon-list-container">
        <div style={{ padding: '10px' }}>
          <SearchField
            placeholder="Search"
            defaultValue={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
          />
        </div>
        <Grid
          items={icons}
          loading={loading}
          onClickItem={(icon) => setAppIcon(icon)}
        />
      </div>
    </>
  );
};
export default MacOSIconList;
