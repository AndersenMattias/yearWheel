import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './interfaces/IDonut';

const Donut = ({
  collectionData,
  selectedCategory,
  circelOneTitle,
  circleOneColour,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoColour,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeColour,
  circleThreeEvCol,
  circelFourTitle,
  circleFourColour,
  circleFourEvCol,
}: IDonutProps): JSX.Element => {
  return (
    <div className={styles.donut}>
      <DonutWheel
        circelOneTitle={circelOneTitle}
        circleOneColour={circleOneColour}
        circleOneEvCol={circleOneEvCol}
        circleTwoTitle={circleTwoTitle}
        circleTwoColour={circleTwoColour}
        circleTwoEvCol={circleTwoEvCol}
        circleThreeTitle={circleThreeTitle}
        circleThreeColour={circleThreeColour}
        circleThreeEvCol={circleThreeEvCol}
        circelFourTitle={circelFourTitle}
        circleFourColour={circleFourColour}
        circleFourEvCol={circleFourEvCol}
        collectionData={collectionData}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default Donut;
