import React from "react";
import styles from "./Search.module.scss";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setChannel,
  setVideoId,
  setVideoTitle,
} from "../../redux/slices/roomSlice";
import { debounce } from "@mui/material/utils";
import {
  UserRole,
  type OfferVideo,
  type YouTubeApiV3ListItemResponse,
} from "../../shared/types";
import type { RootState } from "../../redux/store";
import { getSocket } from "../../socket";
import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import { Controller, get, useForm } from "react-hook-form";

interface CompProps {
  offerVideos: OfferVideo[];
  setOfferVideos: React.Dispatch<React.SetStateAction<OfferVideo[]>>;
}

interface SearchInput {
  search: string;
}

const Search = ({ offerVideos, setOfferVideos }: CompProps) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [searchUrl, setSearchUrl] = React.useState("tom jerry");
  const [searchedVideos, setSearchedVideos] = React.useState<
    YouTubeApiV3ListItemResponse[]
  >([]);

  const [showOffer, setShowOffer] = React.useState(false);
  const { offerTutorial } = useSelector((state: RootState) => state.tutorial);
  const { roomId } = useSelector((state: RootState) => state.room);
  const { role } = useSelector((state: RootState) => state.personal);

  const searchRef = React.useRef<HTMLInputElement>(null);

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchUrl(value);
    }, 500),
    []
  );

  const { control, getValues } = useForm<SearchInput>({
    defaultValues: {
      search: "",
    },
  });

  const onClickSelectVideo = (
    title: string,
    videoId: string,
    image: string,
    channel: string,
    _offer?: boolean
  ) => {
    const selectedVideo = {
      videoId,
      title,
      image,
      channel,
    };

    if (role === UserRole.ADMIN) {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      dispatch(setChannel(channel));

      socket.emit("setVideo", { roomId, selectedVideo });
      if (_offer) {
        setOfferVideos(offerVideos.filter((obj) => obj.videoId != videoId));
        socket.emit("deleteOfferVideo", { roomId, videoId });
      }
    } else {
      socket.emit("setOfferVideo", { roomId, selectedVideo });
    }
  };

  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }&type=video&part=snippet&maxResults=9&q=${searchUrl}`
      )
      .then((res) => {
        setSearchedVideos(res.data.items);
      });
  }, [searchUrl]);

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "50vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
          padding: "5px",
        }}
      >
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Поиск"
              onClick={() => setShowOffer(false)}
              onChange={(e) => {
                field.onChange(e);
                debouncedSearch(e.target.value);
              }}
              inputRef={searchRef}
              placeholder="Введите название"
              sx={{
                width: "78%",
                // Стили для outline и label — учитываем состояние .Mui-error
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  // если MUI добавит класс .Mui-error на корень, это правило сработает тоже
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "error.main",
                  },
                },
                // label: по умолчанию белый, но если есть ошибка — покажем error.main
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& input": {
                  color: "white",
                },
              }}
            />
          )}
        />
        <Box>
          <IconButton
            onClick={() => setShowOffer(false)}
            sx={{
              backgroundColor: showOffer
                ? "rgba(255, 255, 255, 0)"
                : "rgba(255, 255, 255, 0.4)",
            }}
          >
            <SearchIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => setShowOffer(true)}
            sx={{
              backgroundColor: showOffer
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(255, 255, 255,0)",
            }}
          >
            <ExploreIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {!showOffer ? (
        <Box className={styles.search_list}>
          {searchedVideos.map((obj) => {
            return (
              <Box
                key={obj.id.videoId}
                onClick={() =>
                  onClickSelectVideo(
                    obj.snippet.title,
                    obj.id.videoId,
                    obj.snippet.thumbnails.medium.url,
                    obj.snippet.channelTitle
                  )
                }
                className={styles.search_list_video}
              >
                <img
                  src={obj.snippet.thumbnails.medium.url}
                  height={94}
                  width={168}
                />
                <span>{obj.snippet.title}</span>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          className={
            offerTutorial
              ? `${styles.offer_videos} ${styles.tutorial}`
              : styles.offer_videos
          }
        >
          {/* {showOffer && offerVideos.length > 0 && (
          <Box ref={offerRef} className={styles.offer_videos_list}>
            {offerVideos.map((video) => {
              return (
                <Box
                  onClick={() =>
                    onClickSelectVideo(
                      video.title,
                      video.videoId,
                      video.image,
                      video.snippet.channelTitle,
                      true
                    )
                  }
                  key={video.videoId}
                  className={styles.offer_videos_list_item}
                >
                  <img src={video.image} height={94} width={168} />
                  <span>{video.title}</span>
                </Box>
              );
            })}
          </Box>
        )} */}
        </Box>
      )}
    </Box>
  );
};

export default Search;
