import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import Grid, { Item } from '../IconList/Grid';

export interface LocalIconListProps {
  appName: string;
  refresh: (base64: string) => void;
}

const LocalIconList: FC<LocalIconListProps> = (props) => {
  const { appName, refresh } = props;
  const [icons, setIcons] = useState<Item[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appName) {
      window.electron
        .getLocalIcons(appName)
        .then((data) => {
          setIcons(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
      setIcons([]);
    }
  }, [appName]);

  const setAppIconFromeLocalIcnsName = (icon: any) => {
    setLoading(true);
    window.electron
      .changeAppIconFromIcnsName(appName, icon.name)
      .then((base64) => {
        setLoading(false);
        refresh(base64);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Grid
      items={icons}
      loading={loading}
      onClickItem={(icon) => setAppIconFromeLocalIcnsName(icon)}
    />
  );
};
export default LocalIconList;
