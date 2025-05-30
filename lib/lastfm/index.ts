import { URLSearchParams } from 'url'

import type {
  RecentArtistsResponse,
  RecentTracksResponse,
  TopTracksResponse,
  Period,
} from './types'
import { headers } from 'next/headers'
import { USER_AGENT } from '@/utils'

const BASE_URL = 'http://ws.audioscrobbler.com/2.0'

class LastFMClient {
  private user: string
  private apiKey: string
  private revalidateRequests: number

  constructor(user: string, apiKey: string, revalidateRequests: number = 15 * 60) {
    this.apiKey = apiKey
    this.user = user

    this.revalidateRequests = revalidateRequests
  }

  private async request<T extends any>(
    params: URLSearchParams,
  ): Promise<T> {
    params.set("user", this.user)
    params.set("api_key", this.apiKey)
    params.set("format", 'json')

    const resp = await fetch(
      `${BASE_URL}/?${params.toString()}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
        next: {
          tags: ["lastfm"],
          revalidate: this.revalidateRequests
        }
      }
    )

    if (!resp.ok) {
      const error = await resp.text()

      throw new Error(`LastFM HTTPException (${resp.status}): ${error}`)
    }

    return await resp.json()
  }

  async getRecentTracks(
    limit: number = 15,
    page: number = 1,
    from: number = 0,
    extended: 0 | 1 = 0
  ): Promise<RecentTracksResponse> {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      page: page.toString(),
      limit: limit.toString(),
      from: from.toString(),
      extended: extended.toString()
    })

    return this.request<RecentTracksResponse>(params)
  }

  async getTopArtists(
    period: Period,
    limit: number = 15,
    page: number = 1
  ): Promise<RecentArtistsResponse> {
    const params = new URLSearchParams({
      method: 'user.gettopartists',
      limit: limit.toString(),
      page: page.toString(),
      period,
    })

    return this.request<RecentArtistsResponse>(params)
  }

  async getTopTracks(
    period: Period,
    limit: number = 15,
    page: number = 1
  ): Promise<TopTracksResponse> {
    const params = new URLSearchParams({
      method: 'user.gettoptracks',
      period,
      limit: limit.toString(),
      page: page.toString(),
    })

    return this.request<TopTracksResponse>(params)
  }
}

export default LastFMClient