import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';

import socket from '../../socket';
import styles from './Room.module.scss';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { setDisconnect, setRole } from '../../redux/slices/personalSlice';
import {
  setClearAdmintime,
  setClearChangePauseTime,
  setClearUsertime,
  setUsers,
  setVideoId,
  setVideoTitle,
} from '../../redux/slices/roomSlice';
import Tutorial from '../../components/Tutorial';
import YouTubePlayer from '../../components/YouTubePlayer';
import Sidebar from '../../components/Sidebar';

const Room = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState('');
  const [searchUrl, setSearchUrl] = React.useState('');
  const [searchedVideos, setSearchedVideos] = React.useState([]);
  const [offerVideos, setOfferVideos] = React.useState([]);
  const [searchVis, setSearchVis] = React.useState(false);
  const { videoId, roomId } = useSelector((state) => state.room);
  const { role } = useSelector((state) => state.personal);
  const playerRef = React.useRef(null);
  const searchRef = React.useRef(null);

  const [modalVis, setModalVis] = React.useState(role == 'admin' ? true : false);

  React.useEffect(() => {
    socket.on('role', (data) => {
      dispatch(setRole(data));
    });
    socket.on('getUsers', (users) => {
      dispatch(setUsers(users));
    });

    socket.emit('connected', roomId);
    socket.on('getInfo', ({ users, info }) => {
      dispatch(setUsers(users));
      setOfferVideos(info.offerVideos);
      dispatch(setVideoTitle(info.selectedVideo.title));
      dispatch(setVideoId(info.selectedVideo.videoId));
    });

    const handleCloseSearch = (e) => {
      if (searchRef.current && !e.composedPath().includes(searchRef.current)) {
        setSearchVis(false);
      } else {
        setSearchVis(true);
      }
    };
    document.body.addEventListener('click', handleCloseSearch);

    if (role === 'user') {
      socket.on('getVideo', (video) => {
        dispatch(setVideoId(video.videoId));
        dispatch(setVideoTitle(video.title));
      });
    }

    socket.on('getOfferVideos', (data) => {
      setOfferVideos(data);
    });

    return () => {
      socket.emit('dc', roomId);
      dispatch(setClearAdmintime());
      dispatch(setClearUsertime());
      dispatch(setClearChangePauseTime());
      dispatch(setDisconnect());
      dispatch(setRole(null));
      dispatch(setVideoId(''));
      dispatch(setVideoTitle(''));
      dispatch(setUsers([]));
      document.body.removeEventListener('click', handleCloseSearch);
    };
  }, []);

  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_API_KEY}&type=video&part=snippet&maxResults=9&q=${searchUrl}`,
      )
      .then((res) => setSearchedVideos(res.data.items));
  }, [searchUrl]);
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchUrl(value);
    }, 500),
    [],
  );
  const onChangeSearch = (e) => {
    setSearch((prev) => (prev = e.target.value));
    debouncedSearch(e.target.value);
  };

  const onClickSelectVideo = (title, videoId, image) => {
    if (role === 'admin') {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      const selectedVideo = {
        videoId,
        title,
        image,
      };
      socket.emit('setVideo', { roomId, selectedVideo });
    } else {
      const offerVideo = {
        title,
        videoId,
        image,
      };
      socket.emit('setOfferVideo', { roomId, offerVideo });
    }
  };

  const setPlayer = (e) => {
    playerRef.current = e;
  };

  return (
    <div className={styles.room_container}>
      <div className={styles.room_header}>
        <div className={styles.room_header_title}>
          <p>YouTube Cinema</p>
        </div>
        <div className={styles.room_header_search}>
          <div className={styles.room_header_search_video}>
            <input
              onChange={onChangeSearch}
              ref={searchRef}
              value={search}
              placeholder="Введите название"
              type="text"
            />
            {searchVis && (
              <div className={styles.header_search_list}>
                {searchedVideos.map((obj) => {
                  return (
                    <div
                      key={obj.id.videoId}
                      onClick={() =>
                        onClickSelectVideo(
                          obj.snippet.title,
                          obj.id.videoId,
                          obj.snippet.thumbnails.default.url,
                        )
                      }
                      className={styles.header_search_list_video}>
                      <img src={obj.snippet.thumbnails.default.url} />
                      <span>{obj.snippet.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <svg
              onClick={() => {
                setSearch((prev) => (prev = ''));
                if (searchRef.current) {
                  searchRef.current.focus();
                }
              }}
              fill="#000000"
              version="1.1"
              id="Ebene_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              enableBackground="new 0 0 64 64">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M17.586,46.414C17.977,46.805,18.488,47,19,47s1.023-0.195,1.414-0.586L32,34.828l11.586,11.586 C43.977,46.805,44.488,47,45,47s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828L34.828,32l11.586-11.586 c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0L32,29.172L20.414,17.586c-0.781-0.781-2.047-0.781-2.828,0 c-0.781,0.781-0.781,2.047,0,2.828L29.172,32L17.586,43.586C16.805,44.367,16.805,45.633,17.586,46.414z"></path>
                  <path d="M32,64c8.547,0,16.583-3.329,22.626-9.373C60.671,48.583,64,40.547,64,32s-3.329-16.583-9.374-22.626 C48.583,3.329,40.547,0,32,0S15.417,3.329,9.374,9.373C3.329,15.417,0,23.453,0,32s3.329,16.583,9.374,22.626 C15.417,60.671,23.453,64,32,64z M12.202,12.202C17.49,6.913,24.521,4,32,4s14.51,2.913,19.798,8.202C57.087,17.49,60,24.521,60,32 s-2.913,14.51-8.202,19.798C46.51,57.087,39.479,60,32,60s-14.51-2.913-19.798-8.202C6.913,46.51,4,39.479,4,32 S6.913,17.49,12.202,12.202z"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className={styles.room_header_exit}>
          <svg
            onClick={() => {
              navigate('/');
            }}
            fill="#ffffff"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 70 70"
            enableBackground="new 0 0 70 70"
            stroke="#ffffff">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M62.666,32.316L57.758,21.53c-0.457-1.007-1.646-1.449-2.648-0.992c-1.006,0.457-1.45,1.644-0.992,2.648l3.365,7.397 H44.481c-1.104,0-2,0.896-2,2s0.896,2,2,2h13.69l-4.055,8.912c-0.458,1.004-0.014,2.191,0.992,2.648 c0.269,0.121,0.55,0.18,0.827,0.18c0.76,0,1.486-0.436,1.821-1.172l4.939-10.855c0.104-0.196,0.172-0.407,0.206-0.625 C62.988,33.207,62.901,32.726,62.666,32.316z"></path>
                <path d="M51.583,47.577c-1.104,0-2,0.895-2,2v8.006h-11V15.269c0-1.722-0.81-3.25-2.445-3.795L24.536,7.583h25.047v9.994 c0,1.104,0.896,2,2,2s2-0.896,2-2v-12c0-1.104,0.003-1.994-1.102-1.994H12.609l-0.325-0.109c-0.413-0.138-0.694-0.205-1.119-0.205 c-0.829,0-1.94,0.258-2.63,0.755C7.492,4.776,6.583,5.983,6.583,7.269v47.572c0,1.721,1.393,3.25,3.026,3.795l24.146,8 c0.413,0.137,0.913,0.205,1.337,0.205c0.83,0,1.395-0.258,2.084-0.756c1.043-0.752,1.407-1.959,1.407-3.244v-1.258h13.898 c1.104,0,1.102-0.902,1.102-2.006v-10C53.583,48.472,52.688,47.577,51.583,47.577z M34.583,62.841l-24-8V7.583V7.504L10.8,7.345 l23.783,7.924V62.841z"></path>
                <path d="M30.583,47.577c0.553,0,1-0.447,1-1v-6c0-0.553-0.447-1-1-1s-1,0.447-1,1v6C29.583,47.13,30.03,47.577,30.583,47.577z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className={styles.videoRoom}>
        {videoId ? <YouTubePlayer setPlayer={setPlayer} /> : <Tutorial />}

        <Sidebar
          offerVideos={offerVideos}
          setOfferVideos={setOfferVideos}
          player={playerRef.current}
        />
      </div>
      {modalVis && <Modal setModalVis={setModalVis} content={window.location.href} type="share" />}
    </div>
  );
};

export default Room;
