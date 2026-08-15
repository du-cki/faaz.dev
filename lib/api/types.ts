import { number } from "astro:schema";

export type DiscordStatus = "online" | "dnd" | "idle" | "offline";

export type BaseActivity = {
  application_id: number;
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
  created_at: number;
  assets: {
    small_text?: string;
    small_image?: string;
    large_text?: string;
    large_image?: string;
  };
};

export type SpotifyActivity = {
  type: 2;
  id: "spotify:1";
  name: "Spotify";
  flags: 48;
  sync_id: string;
  session_id: string;
  state: string; // artists
  details: string; // song name
  assets: {
    large_image: string; // album art
    large_text: string; // album
  };
  created_at: number;
  timestamps: {
    start: number;
    end: number;
  };
  party: {
    id: "spotify:651454696208465941";
  };
};

export type DiscordActivity = BaseActivity | SpotifyActivity;

export type Presence = {
  status: DiscordStatus;
  activities: DiscordActivity[];
};

export type Location = {
  id: number;
  country: string;
  timezone: string;
  recorded_at: number;
};

export type WSMessage =
  | {
      type: "INIT";
      data: Presence;
    }
  | {
      type: "PRESENCE_UPDATE";
      data: Presence;
    };
