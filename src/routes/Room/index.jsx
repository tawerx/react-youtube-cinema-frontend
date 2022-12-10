import React from 'react';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import socket from '../../socket';
import styles from './Room.module.scss';

const Room = ({ videoId, modal }) => {
  const [player, setPlayer] = React.useState(null);
  const [time, setTime] = React.useState('');
  const [modalVis, setModalVis] = React.useState(modal);
  const [size, setSize] = React.useState(window.screen.availWidth);
  const { videoTitle } = useSelector((state) => state.logic);

  React.useEffect(() => {
    socket.on('getTime', (data) => {
      setTime(data);
    });
    resize();
  }, []);

  React.useEffect(() => {
    if (player) {
      player.seekTo(time, true);
    }
  }, [time]);

  const resize = React.useCallback(() => {
    window.addEventListener('resize', (e) => {
      setSize(e.target.outerWidth);
    });
  }, []);

  const onReady = (e) => {
    setPlayer(e.target);
  };

  const opts = {
    height: '280',
    width: window.screen.width < 510 ? size - 10 : '500',
  };
  return (
    <>
      <Header />
      <div className={styles.videoRoom}>
        <p>{videoTitle}</p>
        <YouTube videoId={videoId} onReady={onReady} opts={opts} />
        <button
          className={styles.sync}
          onClick={() => {
            if (player) {
              socket.emit('time', {
                time: player.getCurrentTime(),
                roomId: videoId,
              });
            }
          }}>
          Синхронизироваться
        </button>
      </div>
      {modalVis && <Modal setModalVis={setModalVis} content={window.location.href} />}
    </>
  );
};

export default Room;
