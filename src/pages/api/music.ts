import type { APIRoute } from "astro";
import LastFMClient from "../../../lib/lastfm";

import type { Image } from "../../../lib/lastfm/types";
import { LASTFM_USERNAME } from "../../../utils/constants";

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
  user: {
    name: string;
    playcount: string;
    artist_count: string;
    track_count: string;
    album_count: string;
    image: Image[];
    created_at: number;
    url: string;
  };
  recentTracks: Track[];
  topTracks: Track[];
  topArtists: Artist[];
};

export const GET: APIRoute = async (request) => {
  const { searchParams } = request.url;
  const minified = !(searchParams.get("minified") === "false");

  const { LASTFM_API_KEY } = import.meta.env;

  if (!LASTFM_API_KEY) {
    return Response.json(
      { error: "Invalid Server Configuration." },
      { status: 500 },
    );
  }

  const client = new LastFMClient(LASTFM_USERNAME, LASTFM_API_KEY);

  const { user: userInfo } = await client.userInfo();

  // since the API is inconsistent with its result and sometimes returns n+1 results
  const rt = await client.getRecentTracks(16 - 1);
  const cutoff =
    rt.recenttracks.track.length % 2 == 0
      ? rt.recenttracks.track.length
      : rt.recenttracks.track.length - 1;

  const response: MusicResponse = {
    user: {
      name: userInfo.name,
      playcount: userInfo.playcount,
      artist_count: userInfo.artist_count,
      track_count: userInfo.track_count,
      album_count: userInfo.album_count,
      image: userInfo.image,
      created_at: userInfo.registered["#text"],
      url: userInfo.url,
    },
    recentTracks: rt.recenttracks.track.slice(-cutoff).map((t) => ({
      name: t.name,
      image: t.image,
      artist: t.artist.name,
      album: t.album["#text"],
      url: t.url,
      loved: t.loved == "1",
    })),
    topTracks: [],
    topArtists: [],
  };

  if (minified) {
    request.cache.set({
      maxAge: 4 * 60,
      tags: ["api", "music", "minified"],
    });

    return Response.json(response);
  }

  const tt = await client.getTopTracks("7day");
  const ta = await client.getTopArtists("7day");

  response.topTracks = tt.toptracks.track.map((t) => ({
    name: t.name,
    image: t.image,
    artist: t.artist.name,
    url: t.url,
    playcount: t.playcount,
  }));

  response.topArtists = ta.topartists.artist.map((a) => ({
    name: a.name,
    image: a.image,
    url: a.url,
    playcount: a.playcount,
  }));

  request.cache.set({
    maxAge: 4 * 60,
    tags: ["api", "music", "maximised"],
  });

  return Response.json(response);
};

export const prerender = false;
