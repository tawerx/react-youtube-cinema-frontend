import React from "react";
import { useSelector } from "react-redux";

import styles from "./sidebar.module.scss";
import Search from "../Search/index.js";
import type { RootState } from "../../redux/store.js";
import { UserRole, type OfferVideo } from "../../shared/types.js";
import { getSocket } from "../../socket.js";

interface CompProps {
  player: YT.Player | null;
  offerVideos: OfferVideo[];
  setOfferVideos: React.Dispatch<React.SetStateAction<OfferVideo[]>>;
}

const Sidebar = ({ player, offerVideos, setOfferVideos }: CompProps) => {
  const socket = getSocket();
  const { videoId, roomId, users } = useSelector(
    (state: RootState) => state.room
  );
  const { infoTutorial } = useSelector((state: RootState) => state.tutorial);
  const { role } = useSelector((state: RootState) => state.personal);
  const [showUsers, setShowUsers] = React.useState(true);
  const [hideDiv, setHideDiv] = React.useState(false);

  return (
    <div className={styles.sidebar}>
      {player && (
        <button
          className={styles.sync}
          onClick={() => {
            if (videoId) {
              if (role === UserRole.USER) {
                socket.emit("syncUser", { roomId });
              }
              if (role === UserRole.ADMIN) {
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
              const objTime = obj.currentTimeMs;

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
                <li key={obj.user.socketId}>{`${obj.user.username}${
                  obj.role == UserRole.ADMIN ? "(admin)" : ""
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
