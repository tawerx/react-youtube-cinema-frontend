import React from 'react';
import styles from './tutorial.module.scss';

const Tutorial = () => {
  return (
    <div className={styles.tutorial}>
      <div className={styles.tutorial_search}>
        <div className={styles.tutorial_search_arrow}>
          <p>Здесь вы можете выбрать видеоролик, который вы желаете просмотреть</p>
        </div>
      </div>
      <div className={styles.tutorial_info}>
        <div className={styles.tutorial_info_arrow}>
          <p>
            Здесь вы можете следить за тем, кто присоединился, а кто отключился, а также у кого
            какое время
          </p>
        </div>
      </div>
      <div className={styles.tutorial_offer}>
        <div className={styles.tutorial_offer_arrow}>
          <p>
            Здесь вы можете выбрать видеоролик, который предложили зрители, у которых нет прав
            администратора
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
