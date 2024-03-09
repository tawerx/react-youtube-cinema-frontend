import React from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import {
  setAdminTime,
  setChangePauseTime,
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setUserTime,
} from "../../redux/slices/roomSlice";
import socket from "../../socket.js";

const YouTubePlayer = ({ setPlayer }) => {
  const dispatch = useDispatch();
  const { videoId, videoTitle, roomId } = useSelector((state) => state.room);
  const { role } = useSelector((state) => state.personal);

  const [widthSize, setWidthSize] = React.useState(window.screen.availWidth);
  const [data3, setData3] = React.useState(false);
  const playerRef = React.useRef(null);
  React.useEffect(() => {
    resize();

    if (role == "user") {
      socket.on("syncUsersByAdmin", (data) => {
        if (playerRef.current) {
          playerRef.current.seekTo(data, true);
        }
      });

      socket.on("syncUsersToRoomTime", (data) => {
        if (playerRef.current) {
          playerRef.current.seekTo(data, true);
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
    window.addEventListener("resize", (e) => {
      setWidthSize(e.target.outerWidth);
    });
  }, []);

  const onReady = (e) => {
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
        videoId={videoId}
        onReady={onReady}
        opts={opts}
        onPause={() => {
          if (role === "admin") {
            socket.emit("adminPause", { roomId });
          }

          let curTime = 0;

          dispatch(
            setChangePauseTime(
              setInterval(() => {
                if (playerRef.current.getCurrentTime() !== curTime) {
                  socket.emit("socketTime", {
                    roomId,
                    time: playerRef.current.getCurrentTime(),
                  });
                  socket.on("currrentSocketTime", (data) => (curTime = data));
                }
              }, 1000)
            )
          );
        }}
        onPlay={() => {
          if (role === "admin") {
            socket.emit("adminPlay", { roomId });
          }
          dispatch(setClearChangePauseTime());
        }}
        onStateChange={(e) => {
          if (e.data == 1 && role == "admin" && !data3) {
            dispatch(
              setAdminTime(
                setInterval(
                  () =>
                    socket.emit("roomTime", {
                      time: playerRef.current.getCurrentTime(),
                      roomId,
                    }),
                  1000
                )
              )
            );
            setData3(true);
          }
          if ((e.data == 2 || e.data == 0) && role == "admin") {
            dispatch(setClearAdmintime());
            setData3(false);
          }
          if (e.data == 1 && !data3) {
            dispatch(
              setUserTime(
                setInterval(
                  () =>
                    socket.emit("socketTime", {
                      roomId,
                      time: playerRef.current.getCurrentTime(),
                    }),
                  500
                )
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
