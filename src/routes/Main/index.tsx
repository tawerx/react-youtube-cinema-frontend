import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShareIcon from "@mui/icons-material/Share";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import borderImg from "../../assets/border.png";
import React from "react";
import { createSocket, destroySocket } from "../../socket";

export const Main = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    destroySocket();
    createSocket();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          backgroundColor: "#1d1d1d",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 2,
            backgroundColor: "#000000",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              textShadow: "2px 0px 10px rgba(255, 255, 255, 0.35)",
              transition: "text-shadow 2s",
              "&:hover": {
                textShadow: "1px 0px 30px rgba(255, 255, 255, 1)",
              },
            }}
          >
            YouTube Cinema
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000000",
              color: "white",
              fontSize: 25,
              transition: "border-radius 2s, box-shadow 1s",
              boxShadow: "rgba(255, 255, 255, 0.1) 0px 0px 10px",
              "&:hover": {
                borderRadius: 5,
                boxShadow: "rgba(255, 255, 255, 0.3) 0px 0px 15px",
              },
              animation:
                "shadow 1.5s linear alternate-reverse 0s infinite both",
              "@keyframes shadow": {
                from: {
                  boxShadow: "rgba(255, 255, 255, 0.1) 0px 0px 10px",
                },
                to: {
                  boxShadow: "rgba(255, 255, 255, 0.3) 0px 0px 15px",
                },
              },
            }}
            onClick={() => navigate("/rooms")}
          >
            Комнаты
          </Button>
        </Box>
        <Box
          sx={{
            borderStyle: "solid",
            borderImage: `url(${borderImg}) 1`,
            width: "60%",
            height: 400,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h6">Что такое YouTube Cinema?</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 90 }} />

              <Typography variant="body1">
                Создай комнату для совместного просмотра
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <ShareIcon sx={{ fontSize: 90 }} />

              <Typography variant="body1">
                Поделись ссылкой на комнату с друзьями
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <LiveTvIcon sx={{ fontSize: 90 }} />

              <Typography variant="body1">
                Выберите ролик и наслаждайтесь просмотром
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
