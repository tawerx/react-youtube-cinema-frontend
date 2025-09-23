import {
  Box,
  Container,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { RoomCard } from "../../components/RoomCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getSocket } from "../../socket";
import type { OnlineRooms } from "../../shared/types";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setNickName } from "../../redux/slices/personalSlice";
import Header from "../../components/Header";

type NickInput = {
  nickName: string;
};

export const RoomsPage = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<OnlineRooms[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<NickInput>({
    mode: "all",
    defaultValues: {
      nickName: "User-" + new Date().getTime().toString(20),
    },
  });

  React.useEffect(() => {
    socket.connect();
    const nickName = getValues().nickName;
    dispatch(setNickName(nickName));
    socket.emit("socketConnect", { nickName });
    socket.emit("getRooms");
    const handleRooms = (rooms: OnlineRooms[]) => {
      setRooms(rooms);
    };
    socket.on("getRooms:ok", handleRooms);

    return () => {
      socket.off("getRooms:ok", handleRooms);
      socket.emit("socketLeaveRoomsPage");
    };
  }, []);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Header />
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#3a3a3aff",
            border: "2px solid black",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              padding: 1,
              borderBottom: "2px solid black",
            }}
          >
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AddCircleOutlineIcon sx={{ fontSize: 40, color: "white" }} />
            </IconButton>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography
                sx={{ p: 2, cursor: "pointer" }}
                onClick={() => {
                  if (errors.nickName) return;
                  const nickName = getValues().nickName;
                  dispatch(setNickName(nickName));
                  socket.emit("setUsername", { nickName });
                  navigate("/rooms/create");
                }}
              >
                Создать комнату
              </Typography>
            </Popover>

            <Controller
              name="nickName"
              control={control}
              rules={{
                required: 'Поле "Никнейм" обязательное',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Никнейм"
                  sx={{
                    flex: "0 1 300px",
                    margin: "0 auto",
                    // Стили для outline и label — учитываем состояние .Mui-error
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: errors.nickName ? "error.main" : "white",
                      },
                      "&:hover fieldset": {
                        borderColor: errors.nickName ? "error.main" : "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: errors.nickName ? "error.main" : "white",
                      },
                      // если MUI добавит класс .Mui-error на корень, это правило сработает тоже
                      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                        borderColor: "error.main",
                      },
                    },
                    // label: по умолчанию белый, но если есть ошибка — покажем error.main
                    "& .MuiInputLabel-root": {
                      color: (theme) =>
                        errors.nickName ? theme.palette.error.main : "white",
                    },
                    "& input": {
                      color: "white",
                    },
                  }}
                  error={Boolean(errors.nickName)}
                  helperText={
                    Boolean(errors.nickName)
                      ? 'Необходимо заполнить поле "Никнейм"'
                      : ""
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    dispatch(setNickName(e.target.value));
                  }}
                  onBlur={() => {
                    field.onBlur();
                  }}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "auto",
              maxHeight: "65vh",
              justifyContent: "center",
              gap: 2,
              padding: 1,
            }}
          >
            {rooms.length === 0 ? (
              <Typography variant="h4" sx={{ color: "white", p: 5 }}>
                Комнат нет, время создать свою
              </Typography>
            ) : (
              rooms.map((value) => <RoomCard key={value.id} roomInfo={value} />)
            )}
          </Box>
        </Box>
      </Box>
      <Outlet />
    </Container>
  );
};
