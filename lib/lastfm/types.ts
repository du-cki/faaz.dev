export type Period =
  | "overall"
  | "7day"
  | "1month"
  | "3month"
  | "6month"
  | "12month";

type Attr = {
  perPage: string;
  totalPages: string;
  page: string;
  total: string;
  user: string;
};

type Date = {
  uts: string;
  "#text": string;
};

export type Image = {
  size: "small" | "medium" | "large" | "extralarge" | "mega";
  "#text": string;
};

type Item = {
  "#text"?: string;
  name?: string;
  url?: string;
  mbid: string;
};

type Track = {
  artist: Item;
  streamable: "0" | "1";
  image: Image[];
  mbid: string;
  album: Item;
  name: string;
  url: string;
  date: Date;
  duration?: string;
  playcount?: number;
  loved: '1' | '0';
};

type Artist = {
  name: string;
  url: string;
  mbid: string;
  streamable: "0" | "1";
  image: Image[];
  playcount: number;
  "@attr": {
    rank: string;
  };
};

type RecentTracks = {
  track: Track[];
  "@attr": Attr;
};

type RecentArtists = {
  artist: Artist[];
  "@attr": Attr;
};

type TopTracks = {
  track: Track[];
  "@attr": Attr;
};

export type RecentTracksResponse = {
  recenttracks: RecentTracks;
};

export type RecentArtistsResponse = {
  topartists: RecentArtists;
};

export type TopTracksResponse = {
  toptracks: TopTracks;
};

export type UserInfoResponse = {
  user: {
    name: string;
    age: string;
    subscriber: string;
    realname: string;
    bootstrap: string;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: Image[];
    registered: {
      unixtime: string;
      "#text": number;
    };
    country: string;
    gender: string;
    url: string;
    type: "user";
  };
};
