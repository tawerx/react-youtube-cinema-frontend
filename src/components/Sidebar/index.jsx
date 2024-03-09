import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideoId, setVideoTitle } from "../../redux/slices/roomSlice";
import socket from "../../socket.js";

import styles from "./sidebar.module.scss";
import Search from "../Search/index.jsx";

const Sidebar = ({ player, offerVideos, setOfferVideos }) => {
  const dispatch = useDispatch();
  const { videoId, roomId, users } = useSelector((state) => state.room);
  const { infoTutorial } = useSelector((state) => state.tutorial);
  const { role } = useSelector((state) => state.personal);
  const [showUsers, setShowUsers] = React.useState(true);
  const [hideDiv, setHideDiv] = React.useState(false);

  const onClickSelectVideo = (videoId, title, image) => {
    if (role === "admin") {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      const selectedVideo = {
        videoId,
        title,
        image,
      };
      socket.emit("setVideo", { roomId, selectedVideo });
    } else {
      const offerVideo = {
        title,
        videoId,
        image,
      };
      socket.emit("setOfferVideo", { roomId, offerVideo });
    }
  };
  return (
    <div className={styles.sidebar}>
      {player && (
        <button
          className={styles.sync}
          onClick={() => {
            if (videoId) {
              if (role === "user") {
                socket.emit("syncUser", { roomId });
              }
              if (role === "admin") {
                socket.emit("syncAdmin", {
                  roomId,
                  time: player.getCurrentTime(),
                });
              }
            }
          }}
        >
          Синхронизироваться
        </button>
      )}

      {!hideDiv && (
        <div
          className={
            infoTutorial
              ? `${styles.sidebar_video_info} ${styles.tutorial}`
              : showUsers
              ? styles.sidebar_video_info
              : `${styles.sidebar_video_info} ${styles.hide}`
          }
        >
          <ul>
            {users.map((obj) => {
              let time;
              const objTime = obj.current_video_time;

              if (objTime > 3600) {
                time = `${Math.trunc(objTime / 3600)}:${
                  Math.trunc(
                    (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                  ) < 10
                    ? "0" +
                      Math.trunc(
                        (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                      )
                    : Math.trunc(
                        (objTime - Math.trunc(objTime / 3600) * 3600) / 60
                      )
                }:${
                  Math.trunc(objTime % 60) < 10
                    ? "0" + Math.trunc(objTime % 60)
                    : Math.trunc(objTime % 60)
                }`;
              } else {
                time = `${Math.trunc(objTime / 60)}:${
                  Math.trunc(objTime % 60) < 10
                    ? "0" + Math.trunc(objTime % 60)
                    : Math.trunc(objTime % 60)
                }`;
              }
              return (
                <li key={obj.user_id}>{`${obj.username}${
                  obj.rolle == "admin" ? "(admin)" : ""
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
        disabled={infoTutorial}
      >
        {!showUsers ? "Показать" : "Скрыть"}
      </button>
      <Search offerVideos={offerVideos} setOfferVideos={setOfferVideos} />
    </div>
  );
};

export default Sidebar;
