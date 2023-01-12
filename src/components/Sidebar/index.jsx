import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoId, setVideoTitle } from '../../redux/slices/roomSlice';
import socket from '../../socket.js';

import styles from './sidebar.module.scss';

const Sidebar = ({ offerVideos, player, setOfferVideos }) => {
  const dispatch = useDispatch();
  const { videoId, roomId, users } = useSelector((state) => state.room);
  const { role } = useSelector((state) => state.personal);

  const onClickSelectOfferVideo = (videoId, title, image) => {
    if (role === 'admin') {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      const selectedVideo = {
        videoId,
        title,
        image,
      };
      socket.emit('setVideo', { roomId, selectedVideo });
      setOfferVideos(offerVideos.filter((obj) => obj.videoId != videoId));
      socket.emit('deleteOfferVideo', { roomId, videoId });
    } else return;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_video_info}>
        <button
          className={styles.sync}
          onClick={() => {
            if (videoId) {
              if (role === 'user') {
                socket.emit('syncUser', { roomId });
              }
              if (role === 'admin') {
                socket.emit('syncAdmin', {
                  roomId,
                  time: player.getCurrentTime(),
                });
              }
            }
          }}>
          Синхронизироваться
        </button>
        <ul>
          {users.map((obj) => {
            let time;
            if (obj.time > 60) {
              time = `${Math.floor(obj.time / 60)}:${
                obj.time - Math.floor(obj.time / 60) * 60 < 10
                  ? `0${String(obj.time - Math.floor(obj.time / 60) * 60).slice(0, 1)}`
                  : String(obj.time - Math.floor(obj.time / 60) * 60).slice(0, 2)
              }:${String(obj.time - Math.floor(obj.time)).slice(2, 4)}`;
            } else {
              time = `${
                obj.time < 10 ? String(obj.time).slice(0, 1) : String(obj.time).slice(0, 2)
              }:${String(obj.time - Math.floor(obj.time)).slice(2, 4)}`;
            }
            return (
              <li key={obj.id}>{`${obj.userName}${
                obj.role == 'admin' ? '(admin)' : ''
              } - ${time}`}</li>
            );
          })}
        </ul>
      </div>
      <div className={styles.sidebar_offer_video_list}>
        {offerVideos.map((obj) => {
          return (
            <div
              onClick={() => onClickSelectOfferVideo(obj.videoId, obj.title, obj.image)}
              key={obj.videoId}
              className={styles.sidebar_offer_video_list_item}>
              <img src={obj.image} />
              <span>{obj.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
