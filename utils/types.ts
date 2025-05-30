import { SpotifyPayload } from '@/lib/lanyard/types'
import { Image } from '@/lib/lastfm/types'

type Spotify = SpotifyPayload & {
  artists: string[];
};

type Owner = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  // theres a bunch of URLs I ignored, because I had no use for them.
  type: string;
  site_admin: boolean;
}

type License = {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

type ListRepositoryPayload = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string;
  fork: boolean;
  // ignored a bunch of urls again.
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language?: string;
  has_issues: boolean;
  topics: string[];
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: 0;
  license: License;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
}

type Project = {
  homepage: string;
  repo_url: string;
  repo_name: string;
  owner: string;
  owner_url: string;
  description: string;
  stars: number;
  forks: number;
  license_id: string;
  license: string;
  language: string;
  color: string;
  tags: string[];
}

type Status = {
  status?: string;
  spotify?: Option<Spotify>;
  // last_offline: number;
}

type Track = {
  name: string,
  image: Image[],
  artist: string | undefined,
  url: string
  album?: string,
  playcount?: number
}

type Artist = {
  name: string,
  image: Image[],
  url: string,
  playcount: number
}

type SongsResponse = {
  recentTracks: Track[],
  topTracks: Track[],
  topArtists: Artist[],
}

type DiscordRPCActivity = {
  id: string;
  name: string;
  icon: string;
  description: string;
  summary: string;
  type: number;
  is_monetized: boolean;
  is_verified: boolean;
  is_discoverable: boolean;
  third_party_skus: { id: string; sku: string; distributor: string }[];
  hook: boolean;
  aliases: string[];
  guild_id: string;
  executables: { os: string; name: string; arguments?: string; is_launcher: boolean }[];
  storefront_available: boolean;
  integration_types_config: Record<string, object>;
  verify_key: string;
  flags: number;
}

export type {
  Spotify,
  ListRepositoryPayload,
  Project,
  Status,
  Track,
  Artist,
  SongsResponse,
  DiscordRPCActivity
}