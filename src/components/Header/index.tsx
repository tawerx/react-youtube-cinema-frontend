import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: 2,
        backgroundColor: "#000000",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        width: "90%",
        margin: "0 auto",
        color: "white",
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
  );
};

export default Header;
