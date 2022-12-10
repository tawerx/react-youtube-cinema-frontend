import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ content, setModalVis }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <div className={styles.modal_title}>
          <p>Поделись этой ссылкой с другом и смотрите вместе</p>
        </div>
        <div className={styles.modal_url}>
          <span>{content}</span>
        </div>

        <div className={styles.modal_buttons}>
          <button
            onClick={() => {
              setModalVis(false);
              navigator.clipboard.writeText(content);
            }}>
            Скопировать
          </button>
          <button onClick={() => setModalVis(false)}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
