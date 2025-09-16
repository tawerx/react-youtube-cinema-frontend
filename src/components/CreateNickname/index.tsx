import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../socket";
import React from "react";
import { useDispatch } from "react-redux";
import { setRoomId } from "../../redux/slices/roomSlice";
import { Controller, useForm } from "react-hook-form";
import { setNickName } from "../../redux/slices/personalSlice";

type InputData = {
  nickName: string;
};

export const CreateNickname = ({ roomId }: { roomId: string }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<InputData>({
    mode: "all",
    defaultValues: {
      nickName: "User-" + new Date().getTime().toString(20),
    },
  });

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
          Создание никнейма
        </Typography>

        <Controller
          name="nickName"
          control={control}
          rules={{
            required: 'Поле "Никнейм" обязательное',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Никнейм"
              variant="outlined"
              error={Boolean(errors.nickName)}
              helperText={
                Boolean(errors.nickName)
                  ? 'Необходимо заполнить поле "Никнейм"'
                  : ""
              }
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={() => {
                field.onBlur();
              }}
              sx={{
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
            />
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            sx={{
              fontWeight: "bold",
              ":hover": { backgroundColor: "#1565c0" },
            }}
            onClick={() => navigate("/")}
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
              const nickName = getValues("nickName");
              if (!nickName) return;
              dispatch(setNickName(nickName));
              socket.emit("socketConnect", { nickName });
              socket.emit("joinRoom", { roomId: roomId, nickName: nickName });
            }}
          >
            Войти
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
