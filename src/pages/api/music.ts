import type { APIRoute, CacheOptions } from "astro";

import { LASTFM_USERNAME } from "@/utils/constants";

import LastFMClient from "@/lib/lastfm";
import type { Image } from "@/lib/lastfm/types";

type Track = {
  name: string;
  image: Image[];
  artist: string | undefined;
  url: string;
  album?: string;
  playcount?: number;
  loved?: boolean;
};

type Artist = {
  name: string;
  image: Image[];
  url: string;
  playcount: number;
};

export type MusicResponse = {
  topTracks: Track[];
  topArtists: Artist[];
  recentTracks: Track[];
};

export const GET: APIRoute = async (request) => {
  const { LASTFM_API_KEY } = import.meta.env;

  if (!LASTFM_API_KEY) {
    return Response.json(
      { error: "Invalid Server Configuration." },
      { status: 500 },
    );
  }

  const client = new LastFMClient(LASTFM_USERNAME, LASTFM_API_KEY);

  const tt = await client.getTopTracks({ period: "7day", limit: 6 });
  const ta = await client.getTopArtists({ period: "7day", limit: 4 });
  const rt = await client.getRecentTracks({ extended: true, limit: 16 });

  const topTracks: Track[] = tt.toptracks.track.map((t) => ({
    name: t.name,
    image: t.image,
    artist: t.artist.name,
    url: t.url,
    playcount: t.playcount,
  }));

  const topArtists: Artist[] = ta.topartists.artist.map((a) => ({
    name: a.name,
    image: a.image,
    url: a.url,
    playcount: a.playcount,
  }));

  const cutoff =
    rt.recenttracks.track.length % 2 == 0
      ? rt.recenttracks.track.length
      : rt.recenttracks.track.length - 1;

  const recentTracks: Track[] = rt.recenttracks.track
    .slice(-cutoff)
    .map((t) => ({
      name: t.name,
      image: t.image,
      artist: t.artist.name,
      album: t.album["#text"],
      url: t.url,
      loved: t.loved == "1",
    }));

  const response: MusicResponse = {
    topTracks,
    topArtists,
    recentTracks,
  };

  request.cache.set({
    maxAge: 60 * 30,
    tags: ["api", "music"],
  });

  return Response.json(response);
};

export const prerender = false;
