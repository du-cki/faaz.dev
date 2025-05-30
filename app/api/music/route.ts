import LastFMClient from "@/lib/lastfm";

import type { SongsResponse } from "@/utils/types";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const minified = searchParams.get("minified") === "true"

  const { LASTFM_USERNAME, LASTFM_KEY } = process.env;

  if (!LASTFM_USERNAME || !LASTFM_KEY) {
    return Response.json({ error: "Invalid Server Configuration." }, { status: 500 })
  }

  const client = new LastFMClient(
    LASTFM_USERNAME,
    LASTFM_KEY
  )

  const rt = await client.getRecentTracks((minified ? 19 : 30) - 2)

  const response: SongsResponse = {
    recentTracks: rt.recenttracks.track.map(t => ({
      name: t.name,
      image: t.image,
      artist: t.artist['#text'],
      album: t.album['#text'],
      url: t.url
    })),
    topTracks: [],
    topArtists: [],
  }

  if (minified) {
    return Response.json(response)
  }

  const tt = await client.getTopTracks('7day')
  const ta = await client.getTopArtists('7day')

  response.topTracks = tt.toptracks.track.map(t => ({
    name: t.name,
    image: t.image,
    artist: t.artist.name,
    url: t.url,
    playcount: t.playcount
  }))

  response.topArtists = ta.topartists.artist.map(a => ({
    name: a.name,
    image: a.image,
    url: a.url,
    playcount: a.playcount
  }))

  return Response.json(response)
}