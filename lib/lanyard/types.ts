export type DiscordStatus = "online" | "dnd" | "idle" | "offline";

export type DiscordActivity = {
  type: number;
  timestamps: {
    start: number;
    end?: number;
  };
  sync_id?: string;
  session_id?: string;
  party?: { id: string };
  flags?: number;
  state: string;
  name: string;
  id: string;
  details: string;
  created_at: string;
  assets: {
    small_text?: string;
    small_image?: string;
    large_text?: string;
    large_image?: string;
  };
  application_id: string;
};

type DiscordUser = {
  username: string;
  public_flags: number;
  id: string;
  discriminator: string;
  avatar: string;
};

export type SpotifyPayload = {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
};

export type StatusData = {
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_web: boolean;
  listening_to_spotify: boolean;
  kv: Record<string, string>;
  spotify: SpotifyPayload;
  discord_user: DiscordUser;
  discord_status: DiscordStatus;
  activities: DiscordActivity[];
};

export type StatusResponse = {
  success: boolean;
  data: StatusData;
};

export type MeKV = { timezone: string; region: string; updated_at: string };

export type LanyardWSResponse = {
  op: 0;
  d: Record<string, StatusData>;
};

export type ParsedSpotifyPayload = Omit<SpotifyPayload, "artist"> & {
  artist: string[];
};
