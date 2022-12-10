import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setConnect } from '../../redux/slices/logicSlice';
import socket from '../../socket';
import NotFound from '../NotFound';
import Room from '../Room';

const CheckRoom = () => {
  const dispatch = useDispatch();
  const [exist, setExist] = React.useState(false);
  const { id } = useParams();
  const { connected } = useSelector((state) => state.logic);

  React.useEffect(() => {
    socket.emit('checkRoom', id);
    socket.on('getAnswerAboutRoom', (data) => {
      setExist(data);
    });
  }, []);

  if (exist) {
    if (!connected) {
      socket.emit('join', id);
      dispatch(setConnect());

      return <Room videoId={id} modal={false} />;
    }
    return <Room videoId={id} modal={true} />;
  }

  if (!exist) {
    return <NotFound />;
  }
};

export default CheckRoom;
