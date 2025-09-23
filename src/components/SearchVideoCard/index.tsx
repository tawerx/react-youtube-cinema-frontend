import { Box, Tooltip, Typography } from "@mui/material";
import type { SearchVideoCardVideo } from "../../shared/types";
import { formatSeconds } from "../../shared/utils";

type Props = {
  onClickSelectVideo: (
    title: string,
    videoId: string,
    imageUrl: string,
    channel: string,
    duractionIso: string,
    duractionSec: number,
    _offer?: boolean | undefined
  ) => void;
  video: SearchVideoCardVideo;
  clickOnOfferVideo?: boolean;
};

export const SearchVideoCard = ({
  onClickSelectVideo,
  video,
  clickOnOfferVideo,
}: Props) => {
  return (
    <Box
      onClick={() =>
        onClickSelectVideo(
          video.title,
          video.videoId,
          video.imageUrl,
          video.channel,
          video.duractionIso,
          video.duractionSec,
          clickOnOfferVideo
        )
      }
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "row",
        gap: 1,
        maxHeight: "94px",
      }}
    >
      <Box sx={{ position: "relative", height: 94 }}>
        <Box
          component="img"
          src={video.imageUrl}
          height={94}
          width={168}
          sx={{ position: "relative", borderRadius: "5px" }}
        ></Box>

        <Typography
          variant="body1"
          sx={{
            position: "absolute",
            bottom: 5,
            right: 5,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "2px",
            borderRadius: "5px",
          }}
        >
          {formatSeconds(video.duractionSec)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title={video.title}>
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {video.title}
          </Typography>
        </Tooltip>

        <Tooltip title={video.channel}>
          <Typography
            variant="caption"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {video.channel}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};
