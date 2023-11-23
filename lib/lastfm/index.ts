import { URLSearchParams } from 'url'

import type { Period, RecentArtistsResponse, RecentTracksResponse, TopTracksResponse } from './types'

const BASE_URL = 'http://ws.audioscrobbler.com/2.0'

// http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=du_cki&api_key=5d49215f4d43786f1d6c65b8b8c22e27&format=json&limit=10

class LastFMClient {
  private user: string
  private apiKey: string

  constructor (user: string, apiKey: string) {
    this.apiKey = apiKey
    this.user = user
  }

  async getRecentTracks (
    limit: number = 15,
    page: number = 1,
    from: number = 0,
    extended: 0 | 1 = 0
  ): Promise<RecentTracksResponse> {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: this.user,
      api_key: this.apiKey,
      format: 'json',
      limit: limit.toString(),
      page: page.toString(),
      from: from.toString(),
      extended: extended.toString()
    })

    const req = await fetch(`${BASE_URL}/?${params.toString()}`)
    if (!req.ok) {
      throw new Error(`Could not react LastFM, request returned a ${req.status}`)
    }

    return await req.json()
  }

  async getTopArtists (
    period: Period,
    limit: number = 15,
    page: number = 1
  ): Promise<RecentArtistsResponse> {
    const params = new URLSearchParams({
      method: 'user.gettopartists',
      user: this.user,
      api_key: this.apiKey,
      format: 'json',
      period,
      limit: limit.toString(),
      page: page.toString()
    })

    const req = await fetch(`${BASE_URL}/?${params.toString()}`)
    if (!req.ok) {
      throw new Error(`Could not react LastFM, request returned a ${req.status}`)
    }

    return await req.json()
  }

  async getTopTracks (
    period: Period,
    limit: number = 15,
    page: number = 1
  ): Promise<TopTracksResponse> {
    const params = new URLSearchParams({
      method: 'user.gettoptracks',
      user: this.user,
      period,
      limit: limit.toString(),
      page: page.toString(),
      format: 'json',
      api_key: this.apiKey
    })

    const req = await fetch(`${BASE_URL}/?${params.toString()}`)
    if (!req.ok) {
      throw new Error(`Could not react LastFM, request returned a ${req.status}`)
    }

    return await req.json()
  }
}

export default LastFMClient
