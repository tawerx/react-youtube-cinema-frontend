import { Box, Button, Divider, Tooltip, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import type { OnlineRooms } from "../../shared/types";
import noVideoSelected from "../../assets/noVideoSelected.png";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { getSocket } from "../../socket";
import { setRoomId } from "../../redux/slices/roomSlice";
import { formatSeconds } from "../../shared/utils";

interface Props {
  roomInfo: OnlineRooms;
}

export const RoomCard = ({ roomInfo }: Props) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const {
    id,
    currentVideoTitle,
    currentVideoChannel,
    currentVideoImageUrl,
    durationSec,
    _count,
  } = roomInfo;

  console.log(roomInfo);
  const navigate = useNavigate();
  const { nickName } = useSelector((state: RootState) => state.personal);

  return (
    <Box
      sx={{
        color: "white",
        width: "300px",
        backgroundColor: "black",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <img
          src={
            currentVideoImageUrl == "" ? noVideoSelected : currentVideoImageUrl
          }
          alt={currentVideoTitle}
          width="100%"
          height="100%"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 25,
            right: 5,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "4px",
          }}
        >
          <Typography>{formatSeconds(durationSec)}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tooltip title={currentVideoTitle}>
          <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentVideoTitle == "" ? "Видео не выбрано" : currentVideoTitle}
          </Typography>
        </Tooltip>

        <Tooltip title={currentVideoChannel}>
          <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentVideoChannel}
          </Typography>
        </Tooltip>
      </Box>

      <Divider sx={{ width: "100%", borderColor: "rgba(255, 255, 255, 1)" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonIcon />
          <Typography>{_count.members}</Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgba(58, 58, 58, 1)",
            "&:hover": { backgroundColor: "rgba(58, 58, 58, 0.6)" },
          }}
          onClick={() => {
            if (nickName == "") return;
            dispatch(setRoomId(id));
            socket.emit("joinRoom", { nickName, roomId: id });
            navigate(`/rooms/${id}`);
          }}
        >
          Войти
        </Button>
      </Box>
    </Box>
  );
};
