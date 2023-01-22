import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import socket from '../../socket';
import styles from './Modal.module.scss';
import Alert from '../Alert';
import { setConnect, setNickName, setRole } from '../../redux/slices/personalSlice';

const Modal = ({ content, setModalVis, type }) => {
  const { roomId } = useSelector((state) => state.room);
  const { nickName } = useSelector((state) => state.personal);
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState('');
  const [alertMsg, setAlertMsg] = React.useState('');
  const [changeNickName, setChangeNickName] = React.useState(nickName);
  const [alertVis, setAlertVis] = React.useState(false);
  const [copyClick, setCopyClick] = React.useState(false);

  React.useEffect(() => {
    socket.on('role', (data) => dispatch(setRole(data)));
  }, []);

  const onClickChangeNick = () => {
    if (changeNickName != '') {
      dispatch(setNickName(changeNickName));
      socket.emit('setUserName', { nickName: changeNickName, roomId });
    } else {
      setAlertMsg('Вы не ввели никнейм');
      setAlertVis(true);
      setTimeout(() => setAlertVis(false), 2000);
    }
  };

  if (type === 'share') {
    return (
      <div className={styles.modal}>
        {alertVis && <Alert message={alertMsg} />}
        <div className={styles.modal_content}>
          <div className={styles.modal_change_nick}>
            <p>Введите никнейм</p>
            <input
              onChange={(e) => setChangeNickName(e.target.value)}
              value={changeNickName}
              placeholder="Введите никнейм"
              type="text"
              maxLength="15"
            />
            {changeNickName != nickName && <button onClick={onClickChangeNick}>Сохранить</button>}
          </div>
          <div className={styles.modal_title}>
            <p>Поделись этой ссылкой с другом и смотрите вместе</p>
          </div>
          <div className={styles.modal_url}>
            <span>{content}</span>
          </div>

          <div className={styles.modal_buttons}>
            <button
              // className={copyClick && `${styles.copy_click}`}
              id={copyClick ? `${styles.copy_click}` : null}
              onClick={() => {
                navigator.clipboard.writeText(content);
                setCopyClick(true);
              }}>
              {copyClick ? 'Скопировано' : 'Скопировать'}
            </button>
            <button
              onClick={() => {
                setModalVis(false);
                socket.emit('setUserName', { nickName, roomId });
              }}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'join') {
    return (
      <div className={styles.modal}>
        {alertVis && <Alert message={alertMsg} />}
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>
            <p>Введите никнейм</p>
          </div>
          <div className={styles.modal_nickname}>
            <input
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              placeholder="Введите никнейм"
              maxLength="15"
            />
          </div>
          <div className={styles.modal_buttons}>
            <button
              onClick={() => {
                if (userName != '') {
                  setModalVis(false);
                  dispatch(setNickName(userName));
                  socket.emit('join', { roomId, userName });
                  setTimeout(() => dispatch(setConnect()), 100);
                } else {
                  setAlertMsg('Вы не ввели никнейм');
                  setAlertVis(true);
                  setTimeout(() => setAlertVis(false), 2000);
                }
              }}>
              Присоединиться
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
