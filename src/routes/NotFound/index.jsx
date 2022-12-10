import React from 'react';
import Header from '../../components/Header';

import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <>
      <Header />
      <div className={styles.not_found}>
        <div className={styles.not_found_content}>
          <span>
            К сожалению, данной страницы не существует. Возможно сессия просмотра была прекращена
            либо введен неверный идентификатор ролика, а может что то другое :)
          </span>
        </div>
      </div>
    </>
  );
};

export default NotFound;
