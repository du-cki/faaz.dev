import LastFM from '~/lib/lastfm'
import { type SongsResponse } from '~/utils/types'

const LASTFM_STORAGE = useStorage('lastfm')

export default defineEventHandler(async (event) => {
  const isMinifiedResponse = getQuery(event).minified === 'true' || false

  const storage: any = await LASTFM_STORAGE.getItem(isMinifiedResponse ? 'cache:minified' : 'cache')
  if (storage && storage.last_updated_at > (Date.now() - 5 * 60 * 1000)) {
    return storage
  }

  const config = useRuntimeConfig()
  const client = new LastFM(
    'du_cki',
    config.LAST_FM_API_KEY
  )

  const rt = await client.getRecentTracks((isMinifiedResponse ? 15 : 30) - 1)

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
    last_updated_at: Date.now()
  }

  if (isMinifiedResponse) {
    await LASTFM_STORAGE.setItem('cache:minified', response)
    return response
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

  await LASTFM_STORAGE.setItem('cache', response)

  return response
})
