import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './interfaces/IDonut';

const Donut = ({
  collectionData,
  eventListData,
  description,
  colour,
}: IDonutProps): JSX.Element => {
  return (
    <div className={styles.donut}>
      <DonutWheel
        collectionData={collectionData}
        eventListData={eventListData}
      />
    </div>
  );
};

export default Donut;
