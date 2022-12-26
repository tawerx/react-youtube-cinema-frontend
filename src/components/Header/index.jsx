import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.header} onClick={() => navigate('/')}>
      <span>YouTube Cinema</span>
    </div>
  );
};

export default Header;
