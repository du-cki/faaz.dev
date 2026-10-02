import { URLSearchParams } from "url";

import type {
  RecentArtistsResponse,
  RecentTracksResponse,
  TopTracksResponse,
  Period,
  UserInfoResponse,
} from "./types";

import { USER_AGENT } from "@/utils/constants";

const _ = <T extends Record<string, undefined | string>>(
  obj: T,
): Record<string, string> => {
  const filteredObj = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != undefined),
  );

  return filteredObj as any;
};

class LastFMClient {
  private user: string;
  private apiKey: string;

  private BASE_URL = "http://ws.audioscrobbler.com/2.0";

  constructor(user: string, apiKey: string) {
    this.apiKey = apiKey;
    this.user = user;
  }

  private async request<T>(params: URLSearchParams): Promise<T> {
    params.set("user", this.user);
    params.set("api_key", this.apiKey);
    params.set("format", "json");

    const resp = await fetch(`${this.BASE_URL}/?${params.toString()}`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!resp.ok) {
      const error = await resp.text();

      throw new Error(`LastFM HTTPException (${resp.status}): ${error}`);
    }

    return await resp.json();
  }

  async getRecentTracks({
    from,
    limit,
    page = 1,
    extended = false,
  }: {
    limit?: number;
    page?: number;
    from?: number;
    extended?: boolean;
  }): Promise<RecentTracksResponse> {
    const params = new URLSearchParams(
      _({
        method: "user.getrecenttracks",
        page: page?.toString(),
        limit: limit?.toString(),
        from: from?.toString(),
        extended: extended ? "1" : "0",
      }),
    );

    return this.request<RecentTracksResponse>(params);
  }

  async getTopTracks({
    period,
    limit,
    page = 1,
  }: {
    period: Period;
    limit: number;
    page?: number;
  }): Promise<TopTracksResponse> {
    const params = new URLSearchParams(
      _({
        method: "user.gettoptracks",
        period,
        limit: limit?.toString(),
        page: page?.toString(),
      }),
    );

    return this.request<TopTracksResponse>(params);
  }

  async getTopArtists({
    period,
    limit,
    page = 1,
  }: {
    period: Period;
    limit: number;
    page?: number;
  }): Promise<RecentArtistsResponse> {
    const params = new URLSearchParams(
      _({
        method: "user.gettopartists",
        period,
        limit: limit?.toString(),
        page: page?.toString(),
      }),
    );

    return this.request<RecentArtistsResponse>(params);
  }

  async userInfo(user?: string): Promise<UserInfoResponse> {
    const params = new URLSearchParams({
      method: "user.getInfo",
      user: user || this.user,
    });

    return this.request<UserInfoResponse>(params);
  }
}

export default LastFMClient;
