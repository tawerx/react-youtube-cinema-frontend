import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../redux/slices/roomSlice";
import { useParams } from "react-router-dom";
import { getSocket } from "../../socket";
import type { RootState } from "../../redux/store";
import NotFound from "../../routes/NotFound";
import { CreateNickname } from "../../components/CreateNickname";

interface CompProps {
  children: React.ReactNode;
}

const CheckRoom = ({ children }: CompProps) => {
  const socket = getSocket();
  const { roomid } = useParams();
  const dispatch = useDispatch();
  const [exist, setExist] = React.useState(false);
  const { nickName } = useSelector((state: RootState) => state.personal);

  React.useEffect(() => {
    socket.connect();

    socket.emit("checkRoom", { roomId: roomid });
    socket.on("getAnswerAboutRoom", ({ answer }: { answer: boolean }) => {
      dispatch(setRoomId(roomid));
      setExist((prev) => (prev = answer));
      if (nickName) {
        socket.emit("joinRoom", { roomId: roomid, nickName: nickName });
      }
    });
  }, []);

  if (exist && nickName) {
    return <>{children}</>;
  }

  if (exist && !nickName) {
    return <CreateNickname roomId={roomid!} />;
  }

  if (!exist) {
    return <NotFound />;
  }
};

export default CheckRoom;
