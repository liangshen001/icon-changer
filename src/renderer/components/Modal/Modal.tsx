import * as React from 'react';
import './Modal.css';
import { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from '@liangshen/react-desktop/macOs';

interface IModalProps {
  children: React.ReactNode | React.ReactElement[];
  title?: React.ReactNode;
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  footer?: [React.ReactNode, React.ReactNode] | React.ReactNode;
}

const Modal: FC<IModalProps> = (props) => {
  const {
    title,
    visible,
    okText,
    cancelText,
    children,
    onOk,
    onCancel,
    footer,
  } = props;
  if (!visible) {
    return <></>;
  }
  return (
    <div>
      <div className="modal-mask" />
      <div className="modal-container">
        {title && (
          <div className="modal-header">
            <div className="modal-title">{title}</div>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer !== null && (
          <div className="modal-footer">
            {footer ? (
              <>
                <div>{footer instanceof Array && footer[0]}</div>
                <div>{footer instanceof Array ? footer[1] : footer}</div>
              </>
            ) : (
              <>
                <div />
                <div>
                  <Button onClick={onCancel}>{cancelText}</Button>
                  <Button color="blue" onClick={onOk}>
                    {okText}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
Modal.defaultProps = {
  onCancel: () => {},
  onOk: () => {},
  okText: 'OK',
  cancelText: 'Cancel',
  footer: undefined,
  title: undefined,
};

export default Modal;
