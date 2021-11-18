import * as React from 'react';
import styles from './Donut.module.scss';
import DonutWheel from './DonutWheel';
import { IDonutProps } from './interfaces/IDonut';

const Donut = ({
  collectionData,
  selectedCategory,
  library,
  circelOneTitle,
  circleOneColour,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoColour,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeColour,
  circleThreeEvCol,
  circleFourTitle,
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
        circleFourTitle={circleFourTitle}
        circleFourColour={circleFourColour}
        circleFourEvCol={circleFourEvCol}
        collectionData={collectionData}
        selectedCategory={selectedCategory}
        library={library}
      />
    </div>
  );
};

export default Donut;
