import { USER_AGENT } from "@/utils/constants";

import type { WakatimeStatsResponse } from "./types";

const BASE_URL = "https://wakatime.com/api/v1";

class WakatimeClient {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getStats(
    range: string = "last_7_days"
  ): Promise<WakatimeStatsResponse> {
    const req = await fetch(`${BASE_URL}/users/current/stats/${range}`, {
      headers: {
        "User-Agent": USER_AGENT,
        Authorization: `Basic ${Buffer.from(this.apiKey).toString("base64")}`,
      },
      next: {
        revalidate: 60,
      },
    });

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    return req.json();
  }
}

export default WakatimeClient;
