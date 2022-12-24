import React from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  setConnect,
  setNickName,
  setRole,
  setVideoId,
  setVideoTitle,
} from '../../redux/slices/logicSlice';
import socket from '../../socket';
import styles from './Modal.module.scss';
import Alert from '../Alert';

const Modal = ({ content, setModalVis, type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState('');
  const [alertMsg, setAlertMsg] = React.useState('');
  const [alertVis, setAlertVis] = React.useState(false);
  const { videoId, videoTitle } = useSelector((state) => state.logic);
  const { id } = useParams();

  React.useEffect(() => {
    socket.on('info', ({ videoId, videoTitle }) => {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(videoTitle));
    });
    socket.on('role', (data) => dispatch(setRole(data)));
  }, []);

  if (type === 'share') {
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
  }
  if (type === 'create') {
    return (
      <>
        {alertVis && <Alert message={alertMsg} />}
        <div className={styles.modal}>
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
              />
            </div>
            <div className={styles.modal_buttons}>
              <button
                onClick={() => {
                  if (userName != '') {
                    const key = (+new Date()).toString(16);
                    setModalVis(false);
                    dispatch(setNickName(userName));
                    navigate(`${videoId}?key=${key}`);
                    socket.emit('create', {
                      videoId: videoId || id,
                      userName,
                      videoTitle,
                      key,
                    });
                    dispatch(setConnect());
                  } else {
                    setAlertMsg('Вы не ввели никнейм');
                    setAlertVis(true);
                    setTimeout(() => setAlertVis(false), 2000);
                  }
                }}>
                Создать комнату
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (type === 'join') {
    return (
      <>
        {alertVis && <Alert message={alertMsg} />}
        <div className={styles.modal}>
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
              />
            </div>
            <div className={styles.modal_buttons}>
              <button
                onClick={() => {
                  if (userName != '') {
                    const { key } = qs.parse(location.search.substring(1));
                    setModalVis(false);
                    dispatch(setNickName(userName));
                    socket.emit('join', { key, userName, videoId, videoTitle });
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
      </>
    );
  }
};

export default Modal;
