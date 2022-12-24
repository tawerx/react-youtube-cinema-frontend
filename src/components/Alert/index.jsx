import React from 'react';
import styles from './Alert.module.scss';

const Alert = ({ message }) => {
  return (
    <div className={styles.alert}>
      <div className={styles.alert_message}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Alert;
