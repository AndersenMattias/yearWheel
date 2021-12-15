import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './interfaces/IDonut';

const Donut = ({
  selectedCategory,
  library,
  colorPicker,
  circelOneTitle,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeEvCol,
  circleFourTitle,
  circleFourEvCol,
}: IDonutProps): JSX.Element => {
  return (
    <div className={styles.donut}>
      <DonutWheel
        circelOneTitle={circelOneTitle}
        circleOneEvCol={circleOneEvCol}
        circleTwoTitle={circleTwoTitle}
        circleTwoEvCol={circleTwoEvCol}
        circleThreeTitle={circleThreeTitle}
        circleThreeEvCol={circleThreeEvCol}
        circleFourTitle={circleFourTitle}
        circleFourEvCol={circleFourEvCol}
        selectedCategory={selectedCategory}
        library={library}
        colorPicker={colorPicker}
      />
    </div>
  );
};

export default Donut;
