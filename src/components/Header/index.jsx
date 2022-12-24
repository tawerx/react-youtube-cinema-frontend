import React from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setDisconnect,
  setRole,
  setUsers,
  setVideoId,
  setVideoTitle,
} from '../../redux/slices/logicSlice';
import socket from '../../socket';

import styles from './Header.module.scss';

const Header = () => {
  const location = useLocation();
  const { connected } = useSelector((state) => state.logic);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { key } = qs.parse(location.search.substring(1));
  return (
    <div
      className={styles.header}
      onClick={() => {
        navigate('/');
        if (key && connected) {
          socket.emit('dc', key);
          dispatch(setClearAdmintime());
          dispatch(setClearUsertime());
          dispatch(setClearChangePauseTime());
          dispatch(setDisconnect());
          dispatch(setRole(null));
          dispatch(setVideoId(''));
          dispatch(setVideoTitle(''));
          dispatch(setUsers([]));
        }
      }}>
      <span>YouTube Cinema</span>
    </div>
  );
};

export default Header;
