import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoId, setVideoTitle } from '../../redux/slices/roomSlice';
import socket from '../../socket.js';

import styles from './sidebar.module.scss';

const Sidebar = ({ player, relatedVideos }) => {
  const dispatch = useDispatch();
  const { videoId, roomId, users } = useSelector((state) => state.room);
  const { infoTutorial } = useSelector((state) => state.tutorial);
  const { role } = useSelector((state) => state.personal);
  const [showUsers, setShowUsers] = React.useState(true);
  const [hideDiv, setHideDiv] = React.useState(false);

  const onClickSelectVideo = (videoId, title, image) => {
    if (role === 'admin') {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      const selectedVideo = {
        videoId,
        title,
        image,
      };
      socket.emit('setVideo', { roomId, selectedVideo });
    } else {
      const offerVideo = {
        title,
        videoId,
        image,
      };
      socket.emit('setOfferVideo', { roomId, offerVideo });
    }
  };
  return (
    <div className={styles.sidebar}>
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

      {!hideDiv && (
        <div
          className={
            infoTutorial
              ? `${styles.sidebar_video_info} ${styles.tutorial}`
              : showUsers
              ? styles.sidebar_video_info
              : `${styles.sidebar_video_info} ${styles.hide}`
          }>
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
                }${
                  obj.time != 0 ? ':' + String(obj.time - Math.floor(obj.time)).slice(2, 4) : ':00'
                }`;
              }
              return (
                <li key={obj.id}>{`${obj.userName}${
                  obj.role == 'admin' ? '(admin)' : ''
                } - ${time}`}</li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        className={
          infoTutorial && !showUsers
            ? `${styles.show_info} ${styles.tutorial}`
            : infoTutorial && showUsers
            ? `${styles.show_info} ${styles.hide} ${styles.tutorial}`
            : !showUsers
            ? styles.show_info
            : `${styles.show_info} ${styles.hide}`
        }
        onClick={() => {
          if (showUsers) {
            setShowUsers((prev) => (prev = false));
            setTimeout(() => setHideDiv((prev) => (prev = true)), 1500);
          } else {
            setShowUsers((prev) => (prev = true));
            setHideDiv((prev) => (prev = false));
          }
        }}
        disabled={infoTutorial}>
        {!showUsers ? 'Показать' : 'Скрыть'}
      </button>
      {relatedVideos.length != 0 && (
        <div className={styles.sidebar_offer_video_list}>
          {relatedVideos.map((obj) => {
            return (
              <div
                onClick={() =>
                  onClickSelectVideo(
                    obj.id.videoId,
                    obj.snippet.title,
                    obj.snippet.thumbnails.medium.url,
                  )
                }
                key={obj.id.videoId}
                className={styles.sidebar_offer_video_list_item}>
                <img src={obj.snippet.thumbnails.medium.url} height={94} width={168} />
                <span>{obj.snippet.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
