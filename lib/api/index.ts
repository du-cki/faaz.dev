import { resolveUrl } from "@/utils/";
import { USER_AGENT } from "@/utils/constants";

import JSONBig from "json-bigint";

import type { DiscordActivity, Location, Presence, WSMessage } from "./types";

type Callback = (data: Presence) => unknown;

export default class APIClient {
  private callbacks: Callback[] = [];

  private socket: Option<WebSocket> = null;
  private heartbeatInterval: Option<NodeJS.Timeout> = null;

  private BASE_URL = import.meta.env.PUBLIC_API_URL;

  constructor() {
    // when user tabs and tabs back in, we need to reconnect
    // the websocket connection if its disconnected.
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.checkAndReconnect();
        }
      });
    }
  }

  async get_location(): Promise<Location> {
    const req = await fetch(`${resolveUrl(this.BASE_URL)}/location`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    const resp = await req.text();
    return JSONBig.parse(resp);
  }

  async get_recent_activities({
    limit = 2,
    excluded = [],
  }: {
    limit?: number;
    excluded?: string[];
  }): Promise<DiscordActivity[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      excluded: excluded.join(","),
    });

    const req = await fetch(`${resolveUrl(this.BASE_URL)}/recent?${params}`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    const resp = await req.text();
    return JSONBig.parse(resp);
  }

  add_callback(callback: Callback) {
    this.callbacks.push(callback);
  }

  remove_callback(callback: Callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  connect() {
    this.disconnect();

    const socket = new WebSocket(`${resolveUrl(this.BASE_URL, "ws")}/ws`);
    socket.addEventListener("open", () => {
      this.heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 5000);
    });

    socket.addEventListener("message", ({ data: event }) => {
      const message: WSMessage = JSONBig.parse(event);
      if (message.type !== "INIT" && message.type !== "PRESENCE_UPDATE") {
        return;
      }

      this.callbacks.forEach((callback) => {
        try {
          callback?.(message.data);
        } catch (e) {
          console.error(e);
        }
      });
    });

    socket.addEventListener("close", () => {
      this.clearHeartbeat();
    });

    this.socket = socket;
  }

  disconnect() {
    this.clearHeartbeat();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private clearHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private checkAndReconnect() {
    if (
      !this.socket ||
      this.socket.readyState === WebSocket.CLOSED ||
      this.socket.readyState === WebSocket.CLOSING
    ) {
      this.connect();
    }
  }
}

export type { Presence };
