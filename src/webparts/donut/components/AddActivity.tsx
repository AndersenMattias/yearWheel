import * as React from 'react';
import { useRef } from 'react';

import styles from './Donut.module.scss';
import UseOutsideClick from './UseOutsideClick/UseOutsideClick';

interface Props {
  modalActivity: boolean;
  setModalActivity: (boolean) => void;
}

const AddActivity: React.FC<Props> = ({ modalActivity, setModalActivity }) => {
  const ref = useRef();

  UseOutsideClick(ref, () => {
    if (modalActivity) setModalActivity(false);
  });

  return (
    <div className={styles.addActivityContainer} ref={ref}>
      <h1>Lägg till..</h1>
    </div>
  );
};

export default AddActivity;
