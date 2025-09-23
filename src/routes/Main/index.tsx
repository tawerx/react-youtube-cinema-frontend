import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShareIcon from "@mui/icons-material/Share";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import borderImg from "../../assets/border.png";
import React from "react";
import { createSocket, destroySocket } from "../../socket";
import Header from "../../components/Header";

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
        <Header />
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
            width: "50vw",
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
            padding: 2,

            "@media (max-width: 1450px)": {
              width: "70vw",
            },
            "@media (max-width: 1230px)": {
              width: "80vw",
            },
            "@media (max-width: 550px)": {
              width: "90vw",
            },
          }}
        >
          <Typography variant="h6">Что такое YouTube Cinema?</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              "@media(max-width: 550px)": {
                flexDirection: "column",
                padding: 2,
                gap: 10,
              },
            }}
          >
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
