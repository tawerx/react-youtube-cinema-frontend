import { accessToJoinRoom } from "../../shared/types";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CompProps {
  access: accessToJoinRoom;
}

export const WaitAccessToJoinRoom = ({ access }: CompProps) => {
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography>
            {access === accessToJoinRoom.PENDING
              ? "Ожидайте подтверждения администратором"
              : "К сожалению администратор отклонил ваше запрос"}
          </Typography>
          {access === accessToJoinRoom.REJECT && (
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black" }}
                onClick={() => navigate("/rooms")}
              >
                Комнаты
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black" }}
                onClick={() => navigate("/")}
              >
                Главное меню
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};
