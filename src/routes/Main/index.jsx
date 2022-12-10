import React from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setConnect, setVideoId, setVideoTitle } from '../../redux/slices/logicSlice';
import socket from '../../socket';

import styles from './Main.module.scss';

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = React.useState('');
  const [searchUrl, setSearchUrl] = React.useState('ulbi');
  const [videos, setVideos] = React.useState([]);

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchUrl(value);
    }, 1000),
    [],
  );

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };
  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_API_KEY}&type=video&part=snippet&maxResults=9&q=${searchUrl}`,
      )
      .then((res) => setVideos(res.data.items));
  }, [searchUrl]);

  const video = videos.map((obj) => {
    return (
      <div className={styles.video} key={obj.etag}>
        <img
          onClick={() => {
            navigator.clipboard.writeText('Hello Alligator!');
            dispatch(setVideoId(obj.id.videoId));
            navigate(obj.id.videoId);
            socket.emit('join', obj.id.videoId);
            dispatch(setConnect());
            dispatch(setVideoTitle(obj.snippet.title));
          }}
          src={obj.snippet.thumbnails.medium.url}
          width={320}
          height={180}
        />
        <p>{obj.snippet.title}</p>
      </div>
    );
  });

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.search}>
          <input value={search} onChange={onChangeSearch} placeholder="Введите название" />
        </div>
        {videos.length > 0 && <div className={styles.content}>{video}</div>}
      </div>
    </>
  );
};

export default Main;
