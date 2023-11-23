type Period = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

interface Attr {
  perPage: string
  totalPages: string
  page: string
  total: string
  user: string
}

interface Date {
  uts: string
  '#text': string
}

interface Image {
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega'
  '#text': string
}

interface Item {
  '#text'?: string
  name?: string,
  url?: string,
  mbid: string
}

interface Track {
  artist: Item
  streamable: '0' | '1'
  image: Image[]
  mbid: string
  album: Item
  name: string
  url: string
  date: Date
  duration?: string
  playcount?: number
}

interface Artist {
  name: string
  url: string
  mbid: string
  streamable: '0' | '1'
  image: Image[]
  playcount: number
  '@attr': {
    rank: string
  }
}

interface RecentTracks {
  track: Track[]
  '@attr': Attr
}

interface RecentArtists {
  artist: Artist[],
  '@attr': Attr
}

interface TopTracks {
  track: Track[],
  '@attr': Attr
}

interface RecentTracksResponse {
  recenttracks: RecentTracks
}

interface RecentArtistsResponse {
  topartists: RecentArtists
}

interface TopTracksResponse {
  toptracks: TopTracks
}

export type {
  RecentTracksResponse,
  RecentArtistsResponse,
  TopTracksResponse,
  Image,
  Period
}
