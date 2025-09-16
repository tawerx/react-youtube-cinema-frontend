import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../redux/slices/personalSlice";
import {
  setChannel,
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setRoomId,
  setUsers,
  setUsersTime,
  setVideoId,
  setVideoTitle,
} from "../../redux/slices/roomSlice";
import Header from "../../components/Header";
import YouTubePlayer from "../../components/YouTubePlayer";
import type { RootState } from "../../redux/store";
import Sidebar from "../../components/Sidebar";
import { destroySocket, getSocket } from "../../socket";
import {
  UserRole,
  type getRoomInfoDTO,
  type getUsersDTO,
} from "../../shared/types";
import { Box, Typography } from "@mui/material";
import sandclock from "../../assets/sandclock.gif";

interface OfferVideo {
  title: string;
  videoId: string;
  image: string;
}

export const Room = () => {
  const dispatch = useDispatch();
  const [offerVideos, setOfferVideos] = React.useState<OfferVideo[]>([]);
  const { videoId, roomId } = useSelector((state: RootState) => state.room);
  const { role } = useSelector((state: RootState) => state.personal);
  // const { showTutorial } = useSelector((state: RootState) => state.tutorial);
  const playerRef = React.useRef<YT.Player>(null);
  const roleRef = React.useRef<UserRole>(null);

  React.useEffect(() => {
    roleRef.current = role;
  }, [role]);

  React.useEffect(() => {
    const socket = getSocket();

    socket.emit("getRoomInfo", { roomId });

    socket.on("role", ({ role }: { role: UserRole }) => {
      console.log(role);
      dispatch(setRole(role));
    });

    socket.on("getUsers", ({ users }: { users: getUsersDTO[] }) => {
      dispatch(setUsers(users));
    });

    socket.on("getUsersTime", ({ currentTime }: { currentTime: number }) => {
      dispatch(setUsersTime(currentTime));
    });

    socket.on("getInfo", ({ roomInfo }: { roomInfo: getRoomInfoDTO }) => {
      // setOfferVideos(roomInfo.quene);
      dispatch(setVideoTitle(roomInfo.currentVideoTitle));
      dispatch(setVideoId(roomInfo.currentVideoId));
      dispatch(setChannel(roomInfo.currentVideoChannel));
    });

    socket.on("getVideo", ({ video }: { video: getRoomInfoDTO }) => {
      if (roleRef.current === UserRole.USER) {
        dispatch(setVideoId(video.currentVideoId));
        dispatch(setVideoTitle(video.currentVideoTitle));
        dispatch(setChannel(video.currentVideoChannel));
      }
    });

    // socket.on("getOfferVideos", (data) => {
    //   setOfferVideos(data);
    // });

    return () => {
      socket.emit("disconnectRoom");
      destroySocket();
      dispatch(setClearAdmintime());
      dispatch(setClearUsertime());
      dispatch(setClearChangePauseTime());
      dispatch(setRole(null));
      dispatch(setVideoId(""));
      dispatch(setVideoTitle(""));
      dispatch(setUsers([]));
      dispatch(setRoomId(""));
    };
  }, []);

  const setPlayer = (e: YT.Player) => {
    playerRef.current = e;
  };

  const player = <YouTubePlayer setPlayer={setPlayer} />;
  const userWaiting = (
    <Box
      sx={{
        display: "flex",
        width: "250%",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        "@media (max-width: 980px)": { width: "100%", margin: "15px" },
      }}
    >
      <Box
        sx={{
          width: "120px",
          height: "120px",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${sandclock})`,
        }}
      ></Box>
      <Typography component={"p"}>Ждем, когда админ выберет ролик</Typography>
    </Box>
  );
  const adminWaiting = (
    <Box
      sx={{
        display: "flex",
        width: "250%",
        height: "80vh",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        gap: 5,
        "@media (max-width: 980px)": { width: "100%", margin: "15px" },
      }}
    >
      <Box
        sx={{
          width: "120px",
          height: "120px",
          border: "5px solid #fff",
          borderRadius: "50%",
          borderTopColor: "#474747",
          animation: "rotation 5s forwards linear infinite",
          "@keyframes rotation": {
            "0%": {
              transform: "rotate(0)",
            },
            "84%": {
              transform: "rotate(500deg)",
            },
            "95%": {
              border: "5px solid #fff",
              borderTopColor: "#474747",
            },
            "100%": {
              transform: "rotate(1060deg)",
            },
          },
        }}
      ></Box>
      <Typography component={"span"}>
        Осталось совсем немного, выберите ролик в поиске выше
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* {showTutorial && !modalVis && <Tutorial />} */}
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "center",
          margin: "0 auto",
          width: "95%",

          "@media (max-width: 1330px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {videoId ? player : role == UserRole.USER ? userWaiting : adminWaiting}
        <Sidebar
          player={playerRef.current}
          offerVideos={offerVideos}
          setOfferVideos={setOfferVideos}
        />
      </Box>
    </Box>
  );
};
