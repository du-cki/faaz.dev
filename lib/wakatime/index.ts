import { USER_AGENT } from "@/utils/constants";

import type {
  WakatimeProgramLanguagesResponse,
  WakatimeStatsResponse,
} from "./types";

export const DEFAULT_LANGUAGE_COLOR = "#555555";

class WakatimeClient {
  BASE_URL = "https://wakatime.com/api/v1";
  token: string;

  constructor(token: string) {
    this.token = Buffer.from(token).toString("base64");
  }

  async getStats(
    range: string = "last_7_days"
  ): Promise<WakatimeStatsResponse> {
    const req = await fetch(`${this.BASE_URL}/users/current/stats/${range}`, {
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

  async getLanguageColors(): Promise<Record<string, string>> {
    const res = await fetch(`${this.BASE_URL}/program_languages`, {
      headers: {
        "User-Agent": USER_AGENT,
        Authorization: `Basic ${this.token}`,
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as WakatimeProgramLanguagesResponse;
    const normalized = json.data.map(({ name, color }) => [
      name.toLowerCase(),
      color,
    ]);

    return Object.fromEntries(normalized);
  }
}

export default WakatimeClient;
