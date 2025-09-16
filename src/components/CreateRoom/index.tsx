import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../socket";
import React from "react";
import { RoomVisibility } from "../../shared/types";
import { useDispatch } from "react-redux";
import { setRoomId } from "../../redux/slices/roomSlice";

export const CreateRoom = () => {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = React.useState(false);
  const navigate = useNavigate();
  const socket = getSocket();

  React.useEffect(() => {
    socket.on("createRoom:ok", ({ roomId }: { roomId: string }) => {
      dispatch(setRoomId(roomId));
      navigate(`/rooms/${roomId}`);
    });
  }, []);

  return (
    <Stack
      sx={{
        color: "white",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: 9999,
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // потемнее для модалки
        backdropFilter: "blur(3px)", // размытый фон
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#2c2c2c",
          padding: 4,
          borderRadius: 3,
          boxShadow: 6,
          minWidth: 320,
          maxWidth: "90%",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          Создание комнаты
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              value={visibility}
              onChange={(e) => setVisibility(e.target.checked)}
            />
          }
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
          label="Скрыть комнату"
        />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            sx={{
              fontWeight: "bold",
              ":hover": { backgroundColor: "#1565c0" },
            }}
            onClick={() => navigate("/rooms")}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              fontWeight: "bold",
              ":hover": { backgroundColor: "#1565c0" },
            }}
            onClick={() => {
              socket.emit("createRoom", {
                visibility: visibility
                  ? RoomVisibility.PRIVATE
                  : RoomVisibility.PUBLIC,
              });
            }}
          >
            Создать
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
