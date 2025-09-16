import React from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube, { type YouTubeEvent } from "react-youtube";
import {
  setAdminTime,
  setChangePauseTime,
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setUserTime,
} from "../../redux/slices/roomSlice.js";
import type { RootState } from "../../redux/store.js";
import { getSocket } from "../../socket.js";
import { UserRole } from "../../shared/types.js";

interface CompProps {
  setPlayer: (e: YT.Player) => void;
}

const YouTubePlayer = ({ setPlayer }: CompProps) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { videoId, videoTitle, roomId } = useSelector(
    (state: RootState) => state.room
  );
  const { role } = useSelector((state: RootState) => state.personal);

  const [widthSize, setWidthSize] = React.useState(window.screen.availWidth);
  const [data3, setData3] = React.useState(false);
  const playerRef = React.useRef<YT.Player>(null);
  React.useEffect(() => {
    resize();

    if (role == UserRole.USER) {
      socket.on(
        "syncUsersByAdmin",
        ({ currentTime }: { currentTime: number }) => {
          if (playerRef.current) {
            playerRef.current.seekTo(currentTime, true);
          }
        }
      );

      socket.on("syncUsersToRoomTime", ({ time }: { time: number }) => {
        if (playerRef.current) {
          playerRef.current.seekTo(time, true);
        }
      });
    }

    socket.on("play", () => {
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    });
    socket.on("pause", () => {
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
    });
  }, []);

  const resize = React.useCallback(() => {
    window.addEventListener("resize", () => {
      setWidthSize(window.innerWidth);
      // if (e.target) {
      //   setWidthSize(e.target.outerWidth);
      // }
    });
  }, []);

  const onReady = (e: YouTubeEvent<any>) => {
    playerRef.current = e.target;
    setPlayer(e.target);
  };
  const opts = {
    height:
      window.screen.width < 980
        ? window.screen.height * 0.4
        : window.screen.height * 0.7,
    width:
      window.screen.width > 1330
        ? widthSize * 0.6
        : window.screen.width < 1330
        ? widthSize * 0.95
        : widthSize * 0.6,
  };

  return (
    <div>
      <YouTube
        videoId={videoId!}
        onReady={onReady}
        opts={opts}
        onPause={() => {
          if (role === UserRole.ADMIN) {
            socket.emit("adminPause", { roomId });
          }

          // let curTime = 0;

          // dispatch(
          //   setChangePauseTime(
          //     setInterval(() => {
          //       if (
          //         playerRef.current &&
          //         playerRef.current.getCurrentTime() !== curTime
          //       ) {
          //         socket.emit("socketTime", {
          //           roomId,
          //           time: playerRef.current.getCurrentTime(),
          //         });
          //         // socket.on(
          //         //   "currrentSocketTime",
          //         //   (data: number) => (curTime = data)
          //         // );
          //       }
          //     }, 1000)
          //   )
          // );
        }}
        onPlay={() => {
          if (role === UserRole.ADMIN) {
            socket.emit("adminPlay", { roomId });
          }
          dispatch(setClearChangePauseTime());
        }}
        onStateChange={(e) => {
          if (e.data == 1 && role == UserRole.ADMIN && !data3) {
            dispatch(
              setAdminTime(
                setInterval(() => {
                  if (playerRef.current) {
                    socket.emit("roomTime", {
                      time: playerRef.current.getCurrentTime(),
                      roomId,
                    });
                  }
                }, 1000)
              )
            );
            setData3(true);
          }
          if ((e.data == 2 || e.data == 0) && role == UserRole.ADMIN) {
            dispatch(setClearAdmintime());
            setData3(false);
          }
          if (e.data == 1 && !data3) {
            dispatch(
              setUserTime(
                setInterval(() => {
                  if (playerRef.current) {
                    socket.emit("socketTime", {
                      roomId,
                      time: playerRef.current.getCurrentTime(),
                    });
                  }
                }, 500)
              )
            );
            setData3(true);
          }
          if (e.data == 2 || e.data == 0) {
            dispatch(setClearUsertime());
            setData3(false);
          }
        }}
      />
      <p>{videoTitle}</p>
    </div>
  );
};

export default YouTubePlayer;
