import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';

import socket from '../../socket';
import styles from './Room.module.scss';
import { setDisconnect, setRole } from '../../redux/slices/personalSlice';
import {
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setRoomId,
  setUsers,
  setVideoId,
  setVideoTitle,
} from '../../redux/slices/roomSlice';
import Tutorial from '../../components/Tutorial';
import YouTubePlayer from '../../components/YouTubePlayer';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const Room = () => {
  const dispatch = useDispatch();
  const [offerVideos, setOfferVideos] = React.useState([]);
  const [relatedVideos, setRelatedVideos] = React.useState([]);
  const { videoId, roomId } = useSelector((state) => state.room);
  const { role } = useSelector((state) => state.personal);
  const { showTutorial } = useSelector((state) => state.tutorial);
  const playerRef = React.useRef(null);

  const [modalVis, setModalVis] = React.useState(role == 'admin' ? true : false);

  React.useEffect(() => {
    socket.on('role', (data) => {
      dispatch(setRole(data));
    });
    socket.on('getUsers', (users) => {
      dispatch(setUsers(users));
    });
    socket.emit('connected', roomId);
    socket.on('getInfo', ({ users, info }) => {
      dispatch(setUsers(users));
      setOfferVideos(info.offerVideos);
      dispatch(setVideoTitle(info.selectedVideo.title));
      dispatch(setVideoId(info.selectedVideo.videoId));
    });

    if (role === 'user') {
      socket.on('getVideo', (video) => {
        dispatch(setVideoId(video.videoId));
        dispatch(setVideoTitle(video.title));
      });
    }

    socket.on('getOfferVideos', (data) => {
      setOfferVideos(data);
    });

    return () => {
      socket.emit('dc', roomId);
      dispatch(setClearAdmintime());
      dispatch(setClearUsertime());
      dispatch(setClearChangePauseTime());
      dispatch(setDisconnect());
      dispatch(setRole(null));
      dispatch(setVideoId(''));
      dispatch(setVideoTitle(''));
      dispatch(setUsers([]));
      dispatch(setRoomId(''));
    };
  }, []);

  const setPlayer = (e) => {
    playerRef.current = e;
  };

  const player = <YouTubePlayer setPlayer={setPlayer} />;
  const userWaiting = (
    <div className={styles.waiting_clocks}>
      <div className={styles.sandclock}></div>
      <p>Ждем, когда админ выберет ролик</p>
    </div>
  );
  const adminWaiting = (
    <div className={styles.progress_admin}>
      <div className={styles.progressbar}></div>
      <span>Осталось совсем немного, выберите ролик в поиске выше</span>
    </div>
  );

  return (
    <div className={styles.room_container}>
      {modalVis && <Modal setModalVis={setModalVis} content={window.location.href} type="share" />}
      {showTutorial && <Tutorial />}
      <Header
        setRelatedVideos={setRelatedVideos}
        offerVideos={offerVideos}
        setOfferVideos={setOfferVideos}
      />

      <div className={styles.videoRoom}>
        {videoId ? player : role == 'user' ? userWaiting : adminWaiting}
        <Sidebar relatedVideos={relatedVideos} player={playerRef.current} />
      </div>
    </div>
  );
};

export default Room;
