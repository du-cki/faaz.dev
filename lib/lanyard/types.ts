interface DiscordActivity {
  type: number,
  timestamps?: {
    start: number,
    end: number,
  },
  sync_id?: string,
  session_id?: string,
  party?: { id: string },
  flags?: string,
  state: string,
  name: string,
  id: string,
  details: string,
  created_at: string,
  assets: {
    'small_text'?: string,
    'small_image'?: string,
    'large_text'?: string,
    'large_image'?: string,
  },
  application_id: string
}

interface DiscordUser {
  username: string,
  public_flags: number,
  id: string,
  discriminator: string,
  avatar: string
}

interface SpotifyPayload {
  track_id: string,
  timestamps: {
    start: number,
    end: number,
  },
  song: string,
  artist: string,
  album_art_url: string,
  album: string
}

interface StatusData {
  active_on_discord_mobile: boolean,
  active_on_discord_desktop: boolean,
  active_on_discord_web: boolean,
  listening_to_spotify: boolean,
  kv: { string: string }
  spotify: SpotifyPayload,
  discord_user: DiscordUser,
  discord_status: 'online' | 'dnd' | 'idle' | 'offline',
  activities: DiscordActivity[]
}

interface StatusResponse {
  success: boolean
  data: StatusData
}

interface LanyardWSResponse {
  [key: string]: StatusData
}

export type { StatusResponse, LanyardWSResponse, StatusData, SpotifyPayload }
