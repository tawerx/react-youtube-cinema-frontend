import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../redux/slices/roomSlice";
import { useParams } from "react-router-dom";
import { getSocket } from "../../socket";
import type { RootState } from "../../redux/store";
import NotFound from "../../routes/NotFound";
import { CreateNickname } from "../../components/CreateNickname";
import { accessToJoinRoom, RoomVisibility } from "../../shared/types";
import { WaitAccessToJoinRoom } from "../../components/WaitAccessToJoinRoom";

interface CompProps {
  children: React.ReactNode;
}

const CheckRoom = ({ children }: CompProps) => {
  const socket = getSocket();
  const { roomid } = useParams();
  const dispatch = useDispatch();
  const [exist, setExist] = React.useState(false);
  const { nickName } = useSelector((state: RootState) => state.personal);
  const [visibility, setVisibility] = React.useState<RoomVisibility>();
  const [access, setAccess] = React.useState<accessToJoinRoom>(
    accessToJoinRoom.PENDING
  );

  React.useEffect(() => {
    socket.connect();

    socket.emit("checkRoom", { roomId: roomid });

    const handleGetAnswerAboutRoom = ({
      answer,
      visibility,
    }: {
      answer: boolean;
      visibility?: RoomVisibility;
    }) => {
      dispatch(setRoomId(roomid));
      setVisibility(visibility);
      setExist((prev) => (prev = answer));
      if (nickName) {
        socket.emit("joinRoom", { roomId: roomid, nickName: nickName });
      }
    };

    const handleAccessToJoinRoom = ({
      access,
    }: {
      access: accessToJoinRoom;
    }) => {
      setAccess(access);
      console.log(access);
    };

    socket.on("getAnswerAboutRoom", handleGetAnswerAboutRoom);
    socket.on("accessToJoinRoom", handleAccessToJoinRoom);

    return () => {
      socket.off("getAnswerAboutRoom", handleGetAnswerAboutRoom);
      socket.off("accessToJoinRoom", handleAccessToJoinRoom);
    };
  }, []);

  if (
    exist &&
    nickName &&
    visibility === RoomVisibility.PRIVATE &&
    (access === accessToJoinRoom.REJECT || access === accessToJoinRoom.PENDING)
  ) {
    return <WaitAccessToJoinRoom access={access} />;
  }

  if (
    exist &&
    nickName &&
    visibility === RoomVisibility.PRIVATE &&
    access === accessToJoinRoom.ACCEPT
  ) {
    return <>{children}</>;
  }

  if (exist && nickName && visibility === RoomVisibility.PUBLIC) {
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
