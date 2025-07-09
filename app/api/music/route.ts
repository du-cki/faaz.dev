import LastFMClient from "@/lib/lastfm";

import type { Image } from "@/lib/lastfm/types";
import type { NextRequest } from "next/server";

type Track = {
  name: string;
  image: Image[];
  artist: string | undefined;
  url: string;
  album?: string;
  playcount?: number;
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const minified = !(searchParams.get("minified") === "false");

  const { LASTFM_USERNAME, LASTFM_KEY } = process.env;

  if (!LASTFM_USERNAME || !LASTFM_KEY) {
    return Response.json(
      { error: "Invalid Server Configuration." },
      { status: 500 }
    );
  }

  const client = new LastFMClient(LASTFM_USERNAME, LASTFM_KEY);

  const { user: userInfo } = await client.userInfo();

  // since the API returns n+1 results
  const rt = await client.getRecentTracks(16 - 1);

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
    recentTracks: rt.recenttracks.track.map((t) => ({
      name: t.name,
      image: t.image,
      artist: t.artist["#text"],
      album: t.album["#text"],
      url: t.url,
    })),
    topTracks: [],
    topArtists: [],
  };

  if (minified) {
    return Response.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=0",
      },
    });
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

  return Response.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=0",
    },
  });
}
