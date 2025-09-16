import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 2,
          backgroundColor: "#000000",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          color: "white",
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

      <Box
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 120px)",
        }}
      >
        <Box
          sx={{
            width: "500px",
            border: "3px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "5px",
            padding: "15px",
          }}
        >
          <Typography>
            К сожалению, данной страницы не существует. Возможно сессия
            просмотра была прекращена либо введен неверный идентификатор ролика,
            а может что то другое :)
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
