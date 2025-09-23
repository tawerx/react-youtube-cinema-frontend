import { useSelector } from "react-redux";
import Search from "../Search/index.js";
import type { RootState } from "../../redux/store.js";
import { UserRole } from "../../shared/types.js";
import { getSocket } from "../../socket.js";
import { Box, Button } from "@mui/material";
import { UsersSidebar } from "../UsersSidebar/index.js";

interface CompProps {
  player: YT.Player | null;
}

const Sidebar = ({ player }: CompProps) => {
  const socket = getSocket();
  const { videoId, roomId } = useSelector((state: RootState) => state.room);

  const { role } = useSelector((state: RootState) => state.personal);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: "30vw",
        maxWidth: "30vw",
        "@media (max-width: 1330px)": {
          minWidth: "90vw",
          maxWidth: "90vw",
        },
      }}
    >
      {player && (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            textShadow: "rgba(255, 255, 255, 0.6) 0px 0px 1px",
          }}
          onClick={() => {
            if (videoId) {
              if (role === UserRole.USER) {
                socket.emit("syncUser", { roomId });
              }
              if (role === UserRole.ADMIN) {
                socket.emit("syncAdmin", {
                  roomId,
                  time: player.getCurrentTime(),
                });
              }
            }
          }}
        >
          Синхронизироваться
        </Button>
      )}

      <UsersSidebar />

      <Search />
    </Box>
  );
};

export default Sidebar;
