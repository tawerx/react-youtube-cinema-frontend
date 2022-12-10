import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setDisconnect } from '../../redux/slices/logicSlice';
import socket from '../../socket';

import styles from './Header.module.scss';

const Header = () => {
  const { connected } = useSelector((state) => state.logic);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div
      className={styles.header}
      onClick={() => {
        navigate('/');
        if (id && connected) {
          socket.emit('dc', id);
          dispatch(setDisconnect());
        }
      }}>
      <span>YouTube Cinema</span>
    </div>
  );
};

export default Header;
