import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setChannel,
  setDuraction,
  setVideoId,
  setVideoTitle,
} from "../../redux/slices/roomSlice";
import { debounce } from "@mui/material/utils";
import {
  UserRole,
  type OfferVideo,
  type SearchVideoCardVideo,
  type YouTubeApiV3ListItemResponse,
  type YouTubeApiV3VideoListItemResponse,
} from "../../shared/types";
import type { RootState } from "../../redux/store";
import { getSocket } from "../../socket";
import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import { Controller, useForm } from "react-hook-form";
import { isoDurationToSeconds } from "../../shared/utils";
import { SearchVideoCard } from "../SearchVideoCard";

interface SearchInput {
  search: string;
}

const getYouTubeVideos = async (searchValue: string) => {
  try {
    const { items } = (
      await axios.get<{ items: YouTubeApiV3ListItemResponse[] }>(
        `https://www.googleapis.com/youtube/v3/search?key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }&type=video&part=snippet&maxResults=9&q=${searchValue}`
      )
    ).data;

    const videoIds = items.map((item) => item.id.videoId).join(",");
    const duractions = (
      await axios.get<{ items: YouTubeApiV3VideoListItemResponse[] }>(
        `https://www.googleapis.com/youtube/v3/videos?key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }&part=contentDetails&id=${videoIds}`
      )
    ).data;

    return items.map((item) => {
      const duraction = duractions.items.find(
        (duraction) => duraction.id === item.id.videoId
      );
      return {
        ...item,
        videoDuractionIso: duraction!.contentDetails.duration,
        videoDuractionSec: isoDurationToSeconds(
          duraction!.contentDetails.duration
        ),
      };
    });
  } catch (error) {
    console.log(error);
  }
};

const Search = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [searchUrl, setSearchUrl] = React.useState("tom jerry");
  const [searchedVideos, setSearchedVideos] = React.useState<
    (YouTubeApiV3ListItemResponse & {
      videoDuractionIso: string;
      videoDuractionSec: number;
    })[]
  >([]);
  const [offerVideos, setOfferVideos] = React.useState<OfferVideo[]>([]);

  const [showOffer, setShowOffer] = React.useState(false);
  // const { offerTutorial } = useSelector((state: RootState) => state.tutorial);
  const { roomId } = useSelector((state: RootState) => state.room);
  const { role } = useSelector((state: RootState) => state.personal);

  const searchRef = React.useRef<HTMLInputElement>(null);

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchUrl(value);
    }, 500),
    []
  );

  const { control } = useForm<SearchInput>({
    defaultValues: {
      search: "",
    },
  });

  const onClickSelectVideo = (
    title: string,
    videoId: string,
    imageUrl: string,
    channel: string,
    duractionIso: string,
    duractionSec: number,
    clickOnOfferVideo?: boolean
  ) => {
    const selectedVideo = {
      videoId,
      title,
      imageUrl,
      duractionIso,
      duractionSec,
      channel,
    };

    if (role === UserRole.ADMIN) {
      dispatch(setVideoId(videoId));
      dispatch(setVideoTitle(title));
      dispatch(setChannel(channel));
      dispatch(setDuraction({ duractionIso, duractionSec }));

      socket.emit("setVideo", { roomId, selectedVideo });
      if (clickOnOfferVideo) {
        setOfferVideos(offerVideos.filter((obj) => obj.videoId != videoId));
        socket.emit("deleteOfferVideo", { roomId, videoId });
      }
    } else {
      socket.emit("setOfferVideo", { roomId, selectedVideo });
    }
  };

  React.useEffect(() => {
    const handleGetOfferVideos = ({ videos }: { videos: OfferVideo[] }) => {
      setOfferVideos(videos);
    };
    socket.on("getOfferVideos", handleGetOfferVideos);

    return () => {
      socket.off("getOfferVideos", handleGetOfferVideos);
    };
  }, []);

  React.useEffect(() => {
    getYouTubeVideos(searchUrl)
      .then((videos) => {
        if (videos) {
          setSearchedVideos(videos);
        } else {
          throw new Error("Videos is undefiend");
        }
      })
      .catch((error) => console.log(error));
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "auto",
          padding: "5px",
        }}
      >
        {!showOffer
          ? searchedVideos.map((obj) => {
              const video: SearchVideoCardVideo = {
                channel: obj.snippet.channelTitle,
                duractionIso: obj.videoDuractionIso,
                duractionSec: obj.videoDuractionSec,
                imageUrl: obj.snippet.thumbnails.medium.url,
                title: obj.snippet.title,
                videoId: obj.id.videoId,
              };
              return (
                <SearchVideoCard
                  key={video.videoId}
                  video={video}
                  onClickSelectVideo={onClickSelectVideo}
                />
              );
            })
          : offerVideos.map((obj) => {
              const video: SearchVideoCardVideo = {
                channel: obj.channel,
                duractionIso: obj.durationIso,
                duractionSec: obj.durationSec,
                imageUrl: obj.imageUrl,
                title: obj.title,
                videoId: obj.videoId,
              };
              console.log(obj);
              return (
                <SearchVideoCard
                  key={video.videoId}
                  video={video}
                  onClickSelectVideo={onClickSelectVideo}
                  clickOnOfferVideo={true}
                />
              );
            })}
      </Box>
    </Box>
  );
};

export default Search;
