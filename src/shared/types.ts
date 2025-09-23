export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum RoomVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type UserDTO = {
  id: string;
  username: string;
  role: UserRole;
  currentTimeMs: number;
};

export interface OfferVideo {
  title: string;
  videoId: string;
  image: string;
  channel: string;
  duractionIso: string;
  duractionSec: number;
}

export type YouTubeApiV3ListItemResponse = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    desciription: string;
    thumbnails: {
      default: {
        url: string;
        width?: number;
        height?: number;
      };
      medium: {
        url: string;
        width?: number;
        height?: number;
      };
      high: {
        url: string;
        width?: number;
        height?: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

export type OnlineRooms = {
  id: string;
  currentVideoId: string;
  currentVideoTitle: string;
  currentVideoTimeMs: number;
  currentVideoChannel: string;
  currentVideoImageUrl: string;
  _count: {
    members: number;
  };
};

export type getUsersDTO = {
  role: UserRole;
  currentTimeMs: number;
  user: {
    username: string;
    socketId: string;
  };
};

export type getRoomInfoDTO = {
  currentVideoId: string;
  currentVideoTitle: string;
  currentVideoTimeMs: number;
  currentVideoChannel: string;
  currentVideoImageUrl: string;
  duractionIso: string;
  duractionSec: number;
};

export type getRequestUsersDTO = {
  user: {
    username: string;
    socketId: string;
  };
};

export enum accessToJoinRoom {
  PENDING = "PENDING",
  REJECT = "REJECT",
  ACCEPT = "ACCEPT",
}

export type YouTubeApiV3VideoListItemResponse = {
  kind: string;
  etag: string;
  id: string;
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: boolean;
    licensedContent: boolean;
    contentRating: {};
    projection: string;
  };
};

export type SearchVideoCardVideo = {
  title: string;
  videoId: string;
  imageUrl: string;
  channel: string;
  duractionIso: string;
  duractionSec: number;
};
