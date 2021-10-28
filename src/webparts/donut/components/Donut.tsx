import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './IDonutProps';

const Donut = (props: IDonutProps): JSX.Element => {
  return (
    <div className={styles.donut}>
      <DonutWheel props={props} />
    </div>
  );
};

export default Donut;
