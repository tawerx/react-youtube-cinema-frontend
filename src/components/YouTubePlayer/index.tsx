import React from "react";
import { useDispatch, useSelector } from "react-redux";
import YouTube, { type YouTubeEvent } from "react-youtube";
import {
  setAdminTime,
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setUserTime,
} from "../../redux/slices/roomSlice.js";
import type { RootState } from "../../redux/store.js";
import { getSocket } from "../../socket.js";
import { UserRole } from "../../shared/types.js";
import { Box, Typography } from "@mui/material";

interface CompProps {
  setPlayer: (e: YT.Player) => void;
}

const YouTubePlayer = ({ setPlayer }: CompProps) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { videoId, videoTitle, roomId, channel } = useSelector(
    (state: RootState) => state.room
  );
  const { role } = useSelector((state: RootState) => state.personal);
  const roleRef = React.useRef<UserRole>(null);

  const [widthSize, setWidthSize] = React.useState(window.screen.availWidth);
  const [data3, setData3] = React.useState(false);
  const playerRef = React.useRef<YT.Player>(null);

  React.useEffect(() => {
    roleRef.current = role;
  }, [role]);

  React.useEffect(() => {
    resize();

    socket.on(
      "syncUsersByAdmin",
      ({ currentTime }: { currentTime: number }) => {
        if (playerRef.current && roleRef.current === UserRole.USER) {
          playerRef.current.seekTo(currentTime, true);
        }
      }
    );

    socket.on("syncUsersToRoomTime", ({ time }: { time: number }) => {
      if (playerRef.current && roleRef.current === UserRole.USER) {
        playerRef.current.seekTo(time, true);
      }
    });

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
        : window.screen.height * 0.65,
    width:
      window.screen.width > 1330
        ? widthSize * 0.6
        : window.screen.width < 1330
        ? widthSize * 0.95
        : widthSize * 0.6,
  };

  return (
    <Box sx={{ color: "white" }}>
      <YouTube
        videoId={videoId!}
        onReady={onReady}
        opts={opts}
        onPause={() => {
          if (roleRef.current === UserRole.ADMIN) {
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
          if (roleRef.current === UserRole.ADMIN) {
            socket.emit("adminPlay", { roomId });
          }
          dispatch(setClearChangePauseTime());
        }}
        onStateChange={(e) => {
          if (e.data == 1 && roleRef.current === UserRole.ADMIN && !data3) {
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
          if (
            (e.data == 2 || e.data == 0) &&
            roleRef.current == UserRole.ADMIN
          ) {
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
      <Typography variant="h6">{videoTitle}</Typography>
      <Typography variant="body1" sx={{ color: "gray" }}>
        {channel}
      </Typography>
    </Box>
  );
};

export default YouTubePlayer;
