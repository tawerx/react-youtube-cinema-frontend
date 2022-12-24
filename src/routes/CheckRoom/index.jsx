import React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import socket from '../../socket';
import NotFound from '../NotFound';
import Room from '../Room';

const CheckRoom = () => {
  const location = useLocation();
  const [exist, setExist] = React.useState(false);
  const { id } = useParams();
  const { connected } = useSelector((state) => state.logic);
  const [modalVis, setModalVis] = React.useState(!connected);
  const { key } = qs.parse(location.search.substring(1));

  React.useEffect(() => {
    socket.emit('checkRoom', { key });
    socket.on('getAnswerAboutRoom', (data) => {
      setExist(data);
    });
  }, []);

  if (exist && connected) {
    return <Room videoId={id} modal={true} />;
  }

  if (exist && !connected) {
    return <>{modalVis && <Modal type="join" setModalVis={setModalVis} />}</>;
  }

  if (!exist) {
    return <NotFound />;
  }
};

export default CheckRoom;
