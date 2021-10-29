import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './IDonutProps';

const Donut = ({
  collectionData,
  description,
  colour,
}: IDonutProps): JSX.Element => {
  return (
    <div className={styles.donut}>
      <DonutWheel collectionData={collectionData} />
    </div>
  );
};

export default Donut;
