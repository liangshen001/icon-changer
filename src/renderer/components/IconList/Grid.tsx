import './IconList.css';
import { FC } from 'react';
import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ProgressCircle } from '@liangshen/react-desktop/macOs';

export interface Item {
  src: string;
  name: string;
  [T: string]: any;
}

export interface GridProps {
  items: Item[] | undefined;
  onClickItem: (app: Item) => void;
  loading?: boolean;
  padding?: string;
}

const Grid: FC<GridProps> = (props) => {
  const { onClickItem, items, loading, padding } = props;
  return (
    <>
      <div className="icon-list-container" style={{ padding }}>
        {items &&
          items.map((i) => (
            <span
              key={i.src + i.name}
              style={{
                display: 'flex',
                width: '100px',
                flexDirection: 'column',
                maxHeight: '80%',
                alignItems: 'center',
                textAlign: 'center',
              }}
              role="button"
              onClick={() => onClickItem(i)}
            >
              <img
                style={{ width: '60px', height: '60px' }}
                alt=""
                src={i.src}
              />
              <span
                style={{
                  fontSize: '13px',
                  width: '80px',
                  wordBreak: 'break-all',
                  marginTop: '10px',
                  textAlign: 'center',
                  height: '40px',
                }}
              >
                {i.name}
              </span>
            </span>
          ))}
      </div>
      {loading && (
        <div className="progress-circle-container">
          <ProgressCircle size={25} />
        </div>
      )}
    </>
  );
};

Grid.defaultProps = {
  loading: false,
  padding: '0px',
};

export default Grid;
