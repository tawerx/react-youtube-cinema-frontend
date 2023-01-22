import React from 'react';

import axios from 'axios';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setVideoId, setVideoTitle } from '../../redux/slices/roomSlice';
import { setShowTutorial } from '../../redux/slices/tutorialSlice';
import socket from '../../socket';

import styles from './Header.module.scss';

const Header = ({ setRelatedVideos, offerVideos, setOfferVideos }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = React.useState('');
  const [searchUrl, setSearchUrl] = React.useState('tom jerry');
  const [searchedVideos, setSearchedVideos] = React.useState([]);
  const [searchVis, setSearchVis] = React.useState(false);
  const [showOffer, setShowOffer] = React.useState(false);
  const { searchTutorial, offerTutorial } = useSelector((state) => state.tutorial);
  const { videoId, roomId } = useSelector((state) => state.room);
  const { role } = useSelector((state) => state.personal);

  const searchRef = React.useRef(null);
  const offerRef = React.useRef(null);
  const offerSvgRef = React.useRef(null);

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

  const onClickSelectVideo = (title, videoId, image, _offer) => {
    if (role === 'admin') {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      const selectedVideo = {
        videoId,
        title,
        image,
      };
      socket.emit('setVideo', { roomId, selectedVideo });
      if (_offer) {
        setOfferVideos(offerVideos.filter((obj) => obj.videoId != videoId));
        socket.emit('deleteOfferVideo', { roomId, videoId });
      }
    } else {
      const offerVideo = {
        title,
        videoId,
        image,
      };
      socket.emit('setOfferVideo', { roomId, offerVideo });
    }
  };

  React.useEffect(() => {
    const handleCloseSearch = (e) => {
      if (searchRef.current && !e.composedPath().includes(searchRef.current)) {
        setSearchVis(false);
      } else {
        setSearchVis(true);
      }
    };
    document.body.addEventListener('click', handleCloseSearch);

    const handleCloseOffer = (e) => {
      if (
        offerRef.current &&
        !e.composedPath().includes(offerRef.current) &&
        !e.composedPath().includes(offerSvgRef.current)
      ) {
        setShowOffer(false);
      }
    };
    document.body.addEventListener('click', handleCloseOffer);

    return () => {
      document.body.removeEventListener('click', handleCloseSearch);
      document.body.removeEventListener('click', handleCloseOffer);
    };
  }, []);

  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_API_KEY}&type=video&part=snippet&maxResults=9&q=${searchUrl}`,
      )
      .then((res) => setSearchedVideos(res.data.items));
  }, [searchUrl]);

  React.useEffect(() => {
    if (videoId) {
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_API_KEY}&type=video&part=snippet&maxResults=10&relatedToVideoId=${videoId}`,
        )
        .then((res) => setRelatedVideos(res.data.items));
    }
  }, [videoId]);

  return (
    <div className={styles.header}>
      <div onClick={() => navigate('/')} className={styles.header_title}>
        <p>YouTube Cinema</p>
      </div>
      <div className={styles.header_search}>
        <div
          className={
            searchTutorial
              ? `${styles.header_search_video} ${styles.tutorial}`
              : styles.header_search_video
          }>
          {searchTutorial == false ? (
            <input
              onChange={!searchTutorial && onChangeSearch}
              ref={searchRef}
              value={search}
              placeholder="Введите название"
              type="text"
            />
          ) : (
            <div className={`${styles.header_search_video_tutorial}`}>
              <span>Введите название</span>
            </div>
          )}
          {searchVis && !searchTutorial && (
            <div className={styles.header_search_list}>
              {searchedVideos.map((obj) => {
                return (
                  <div
                    key={obj.id.videoId}
                    onClick={() =>
                      onClickSelectVideo(
                        obj.snippet.title,
                        obj.id.videoId,
                        obj.snippet.thumbnails.medium.url,
                      )
                    }
                    className={styles.header_search_list_video}>
                    <img src={obj.snippet.thumbnails.medium.url} height={94} width={168} />
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
        <div
          className={
            offerTutorial ? `${styles.offer_videos} ${styles.tutorial}` : styles.offer_videos
          }>
          {showOffer && offerVideos.length > 0 && (
            <div ref={offerRef} className={styles.offer_videos_list}>
              {offerVideos.map((obj) => {
                return (
                  <div
                    onClick={() => onClickSelectVideo(obj.title, obj.videoId, obj.image, true)}
                    key={obj.videoId}
                    className={styles.offer_videos_list_item}>
                    <img src={obj.image} height={94} width={168} />
                    <span>{obj.title}</span>
                  </div>
                );
              })}
            </div>
          )}
          {showOffer && offerVideos.length == 0 && (
            <div ref={offerRef} className={`${styles.offer_videos_list} ${styles.empty}`}>
              <svg fill="#000000" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M19.5 10c.277 0 .5.223.5.5v3c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-3c0-.277.223-.5.5-.5zm-9 0c.277 0 .5.223.5.5v3c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-3c0-.277.223-.5.5-.5zM15 20c-2.104 0-4.186.756-5.798 2.104-.542.4.148 1.223.638.76C11.268 21.67 13.137 21 15 21s3.732.67 5.16 1.864c.478.45 1.176-.364.638-.76C19.186 20.756 17.104 20 15 20zm0-20C6.722 0 0 6.722 0 15c0 8.278 6.722 15 15 15 8.278 0 15-6.722 15-15 0-8.278-6.722-15-15-15zm0 1c7.738 0 14 6.262 14 14s-6.262 14-14 14S1 22.738 1 15 7.262 1 15 1z"></path>
                </g>
              </svg>
              <span>К сожалению, тут пусто :(</span>
            </div>
          )}
          <svg
            ref={offerSvgRef}
            onClick={() => !offerTutorial && setShowOffer(!showOffer)}
            fill="#ffffff"
            height="200px"
            width="200px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330"
            stroke="#ffffff">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M75,60h240c8.284,0,15-6.716,15-15s-6.716-15-15-15H75c-8.284,0-15,6.716-15,15S66.716,60,75,60z"></path>
                <path d="M315,150H75c-8.284,0-15,6.716-15,15s6.716,15,15,15h240c8.284,0,15-6.716,15-15S323.284,150,315,150z"></path>
                <path d="M315,270H75c-8.284,0-15,6.716-15,15s6.716,15,15,15h240c8.284,0,15-6.716,15-15S323.284,270,315,270z"></path>
                <path d="M15,30c-3.95,0-7.81,1.6-10.61,4.39C1.6,37.189,0,41.05,0,45s1.6,7.81,4.39,10.609C7.19,58.399,11.05,60,15,60 c3.95,0,7.81-1.601,10.61-4.391C28.4,52.81,30,48.95,30,45s-1.6-7.811-4.39-10.61C22.81,31.6,18.95,30,15,30z"></path>
                <path d="M15,150c-3.95,0-7.81,1.6-10.61,4.39C1.6,157.18,0,161.05,0,165s1.6,7.81,4.39,10.609C7.19,178.399,11.05,180,15,180 c3.95,0,7.82-1.601,10.61-4.391C28.4,172.81,30,168.95,30,165s-1.6-7.82-4.39-10.61C22.82,151.6,18.95,150,15,150z"></path>
                <path d="M15,270c-3.95,0-7.81,1.6-10.61,4.39C1.6,277.19,0,281.05,0,285s1.6,7.81,4.39,10.609C7.19,298.399,11.05,300,15,300 c3.95,0,7.81-1.601,10.61-4.391C28.4,292.81,30,288.95,30,285s-1.6-7.81-4.39-10.61C22.81,271.6,18.95,270,15,270z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className={styles.header_help}>
        <svg
          onClick={() => {
            localStorage.setItem('infoTutorial', true);
            dispatch(setShowTutorial(true));
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#ffffff">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12 8V8.5M12 12V16M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Header;
