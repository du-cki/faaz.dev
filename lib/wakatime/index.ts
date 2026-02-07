import { USER_AGENT } from "@/utils/constants";

import type { WakatimeStatsResponse } from "./types";

const BASE_URL = "https://wakatime.com/api/v1";

class WakatimeClient {
  token: string;

  constructor(token: string) {
    this.token = Buffer.from(token).toString("base64");
  }

  async getStats(
    range: string = "last_7_days"
  ): Promise<WakatimeStatsResponse> {
    const req = await fetch(`${BASE_URL}/users/current/stats/${range}`, {
      headers: {
        "User-Agent": USER_AGENT,
        Authorization: `Basic ${this.token}`,
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
