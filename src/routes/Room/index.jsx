import React from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import {
  setAdminTime,
  setChangePauseTime,
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setRole,
  setUsers,
  setUserTime,
} from '../../redux/slices/logicSlice';
import socket from '../../socket';
import styles from './Room.module.scss';

const Room = ({ videoId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [widthSize, setWidthSize] = React.useState(window.screen.availWidth);
  const { videoTitle, role, users } = useSelector((state) => state.logic);
  const [data3, setData3] = React.useState(false);
  const playerRef = React.useRef(null);

  const [modalVis, setModalVis] = React.useState(role == 'admin' ? true : false);

  React.useEffect(() => {
    const { key } = qs.parse(location.search.substring(1));

    resize();

    socket.on('role', (data) => {
      dispatch(setRole(data));
    });
    socket.emit('getUsers', key);
    socket.on('getUsers', (users) => {
      dispatch(setUsers(users));
    });
    if (role == 'user') {
      socket.on('syncUsersByAdmin', (data) => {
        if (playerRef.current) {
          playerRef.current.seekTo(data, true);
        }
      });

      socket.on('syncUsersToRoomTime', (data) => {
        if (playerRef.current) {
          playerRef.current.seekTo(data, true);
        }
      });
    }
  }, []);

  const resize = React.useCallback(() => {
    window.addEventListener('resize', (e) => {
      setWidthSize(e.target.outerWidth);
    });
  }, []);

  const onReady = (e) => {
    playerRef.current = e.target;
  };

  const opts = {
    height: window.screen.width < 510 ? window.screen.height * 0.4 : window.screen.height * 0.7,
    width: window.screen.width < 510 ? widthSize * 0.95 : widthSize * 0.7,
  };

  return (
    <>
      <Header />
      <div className={styles.videoRoom}>
        <div className={styles.video_player}>
          <YouTube
            videoId={videoId}
            onReady={onReady}
            opts={opts}
            onPause={() => {
              let curTime = 0;

              dispatch(
                setChangePauseTime(
                  setInterval(() => {
                    if (playerRef.current.getCurrentTime() !== curTime) {
                      socket.emit('socketTime', {
                        key: qs.parse(location.search.substring(1)).key,
                        time: playerRef.current.getCurrentTime(),
                      });
                      socket.on('currrentSocketTime', (data) => (curTime = data));
                    }
                  }, 500),
                ),
              );
            }}
            onPlay={() => {
              dispatch(setClearChangePauseTime());
            }}
            onStateChange={(e) => {
              if (e.data == 1 && role == 'admin' && !data3) {
                dispatch(
                  setAdminTime(
                    setInterval(
                      () =>
                        socket.emit('roomTime', {
                          time: playerRef.current.getCurrentTime(),
                          key: qs.parse(location.search.substring(1)).key,
                        }),
                      1000,
                    ),
                  ),
                );
                setData3(true);
              }
              if ((e.data == 2 || e.data == 0) && role == 'admin') {
                dispatch(setClearAdmintime());
                setData3(false);
              }
              if (e.data == 1 && !data3) {
                dispatch(
                  setUserTime(
                    setInterval(
                      () =>
                        socket.emit('socketTime', {
                          key: qs.parse(location.search.substring(1)).key,
                          time: playerRef.current.getCurrentTime(),
                        }),
                      1000,
                    ),
                  ),
                );
                setData3(true);
              }
              if (e.data == 2 || e.data == 0) {
                dispatch(setClearUsertime());
                setData3(false);
              }
            }}
          />
        </div>

        <div className={styles.video_info}>
          <p>{videoTitle}</p>
          <button
            className={styles.sync}
            onClick={() => {
              if (playerRef.current) {
                if (role === 'user') {
                  socket.emit('syncUser', { key: qs.parse(location.search.substring(1)).key });
                }
                if (role === 'admin') {
                  socket.emit('syncAdmin', {
                    key: qs.parse(location.search.substring(1)).key,
                    time: playerRef.current.getCurrentTime(),
                  });
                }
              }
            }}>
            Синхронизироваться
          </button>
          <ul>
            {users.map((obj) => {
              let time;
              if (obj.time >= 60) {
                time = `${Math.floor(obj.time / 60)}:${
                  obj.time - Math.floor(obj.time / 60) * 60 < 10
                    ? `0${(obj.time - Math.floor(obj.time / 60) * 60).toFixed(0)}`
                    : (obj.time - Math.floor(obj.time / 60) * 60).toFixed(0)
                }:${String((obj.time - Math.floor(obj.time)).toFixed(2)).substring(2)}`;
              } else {
                time = `${obj.time.toFixed(0)}:${String(
                  (obj.time - Math.floor(obj.time)).toFixed(2),
                ).substring(2)}`;
              }
              return (
                <li key={obj.id}>{`${obj.userName}${
                  obj.role == 'admin' ? '(admin)' : ''
                } - ${time}`}</li>
              );
            })}
          </ul>
        </div>
      </div>
      {modalVis && <Modal setModalVis={setModalVis} content={window.location.href} type="share" />}
    </>
  );
};

export default Room;
