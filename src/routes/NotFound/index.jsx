import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.header} onClick={() => navigate('/')}>
        <span>YouTube Cinema</span>
      </div>
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
