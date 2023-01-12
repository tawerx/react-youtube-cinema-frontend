import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { setRoomId } from '../../redux/slices/roomSlice';
import socket from '../../socket';
import NotFound from '../../routes/NotFound';
import Room from '../../routes/Room';

const CheckRoom = () => {
  const dispatch = useDispatch();
  const [exist, setExist] = React.useState(false);
  const { connected } = useSelector((state) => state.personal);
  const [modalVis, setModalVis] = React.useState(!connected);

  React.useEffect(() => {
    socket.emit('checkRoom', { roomId: window.location.pathname.substring(1) });
    socket.on('getAnswerAboutRoom', (data) => {
      dispatch(setRoomId(window.location.pathname.substring(1)));
      setExist((prev) => (prev = data));
    });
  }, []);

  if (exist && connected) {
    return <Room modal={true} />;
  }

  if (exist && !connected) {
    return <>{modalVis && <Modal type="join" setModalVis={setModalVis} />}</>;
  }

  if (!exist) {
    return <NotFound />;
  }
};

export default CheckRoom;
