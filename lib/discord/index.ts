import type { ApplicationInfo, GameInfo } from "./types";

class DiscordClient {
  private token: string;

  private BASE_URL = "https://discord.com/api/v10";

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(path: string): Promise<T> {
    const resp = await fetch(`${this.BASE_URL}${path}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.873 Chrome/138.0.7204.251 Electron/37.6.0 Safari/537.36",
        "Content-Type": "application/json",
        "X-Discord-Locale": "en-GB",
        "X-Debug-Options": "bugReporterEnabled",
        "X-Discord-Timezone": "Europe/London",
        Authorization: this.token,
      },
    });

    if (!resp.ok) {
      const error = await resp.text();

      throw new Error(`Discord HTTPException (${resp.status}): ${error}`);
    }

    return resp.json() as T;
  }

  async applicationInfo(applicationIds: string[]): Promise<ApplicationInfo[]> {
    const query = new URLSearchParams();
    for (const applicationId of applicationIds) {
      query.append("application_ids", applicationId);
    }

    return this.request<ApplicationInfo[]>(
      `/applications/public?${query.toString()}`,
    );
  }

  async gameInfo(gameIds: string[]): Promise<GameInfo[]> {
    const query = new URLSearchParams();
    for (const gameId of gameIds) {
      query.append("game_ids", gameId);
    }

    query.append("with_supplemental_data", "true");

    return this.request<GameInfo[]>(`/games?${query.toString()}`);
  }
}

export default DiscordClient;
