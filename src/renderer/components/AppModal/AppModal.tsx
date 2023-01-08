import {
  Button,
  SegmentedControl,
  SegmentedControlItem,
} from '@liangshen/react-desktop/macOs';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import Grid from '../IconList/Grid';
import Modal from '../Modal/Modal';
import { getMacOSIcons } from '../../api';
import MacOSIconList from '../MacOSIconList/MacOSIconList';
import LocalIconList from '../LocalIconList/LocalIconList';

export interface AppModalProps {
  app: any;
  onCancel: () => void;
  refresh: (appName: string, base64: string) => void;
}

const AppModal: FC<AppModalProps> = (props) => {
  const { app, onCancel, refresh } = props;
  const [selectedTab, setSelectedTab] = useState('1');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!app);
  }, [app]);

  const invokeRefresh = (base64: string) => {
    refresh(app.name, base64);
    onCancel();
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        const base64 = e.target!.result as string;
        window.electron
          .changeAppIconFromBase64(app.name, base64)
          .then(() => invokeRefresh(base64))
          .catch();
      };
    }
  };

  return (
    <Modal
      visible={visible}
      footer={[
        <>
          <Button>
            <label htmlFor="choose-from-local">
              Choose from local
              <input
                id="choose-from-local"
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={uploadFile}
              />
            </label>
          </Button>
        </>,
        <>
          <Button
            onClick={() => {
              setVisible(false);
              if (onCancel) {
                onCancel();
              }
            }}
          >
            Cancel
          </Button>
        </>,
      ]}
    >
      <SegmentedControl box>
        <SegmentedControlItem
          title="MacOS Icon"
          key="1"
          selected={selectedTab === '1'}
          onSelect={() => setSelectedTab('1')}
        >
          <MacOSIconList appName={app?.name} refresh={invokeRefresh} />
        </SegmentedControlItem>
        <SegmentedControlItem
          title="Local Icon"
          key="2"
          selected={selectedTab === '2'}
          onSelect={() => setSelectedTab('2')}
        >
          <LocalIconList appName={app?.name} refresh={invokeRefresh} />
        </SegmentedControlItem>
      </SegmentedControl>
    </Modal>
  );
};

export default AppModal;
