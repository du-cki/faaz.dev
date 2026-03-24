import { USER_AGENT } from "../../utils/constants";

import type { StatusResponse, StatusData, LanyardWSResponse } from "./types";

type Callback = (data: StatusData) => unknown;

class LanyardClient {
  private callbacks: Callback[] = [];

  private socket: Option<WebSocket> = null;
  private heartbeatInterval: Option<NodeJS.Timeout> = null;
  private activeUser: string;

  private BASE_URL = "api.lanyard.rest";

  constructor(activeUser: string) {
    this.activeUser = activeUser;

    // when user tabs and tabs back in, we need to reconnect
    // the websocket connection if its disconnected.
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && this.activeUser) {
          this.checkAndReconnect();
        }
      });
    }
  }

  async get_status(): Promise<StatusResponse> {
    const req = await fetch(
      `https://${this.BASE_URL}/v1/users/${this.activeUser}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      },
    );

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    return req.json();
  }

  add_callback(callback: Callback) {
    this.callbacks.push(callback);
  }

  remove_callback(callback: Callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  connect() {
    this.disconnect();

    const socket = new WebSocket(`wss://${this.BASE_URL}/socket`);
    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_ids: [this.activeUser] },
        }),
      );

      this.heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op: 3 }));
        }
      }, 30000);
    });

    socket.addEventListener("message", ({ data: event }) => {
      const message: LanyardWSResponse = JSON.parse(event);
      if (message.op !== 0) return;

      let userData: StatusData;
      if (message.t === "INIT_STATE") {
        userData = message.d[this.activeUser!];
      } else if (message.t === "PRESENCE_UPDATE") {
        userData = message.d;
      }

      this.callbacks.forEach((callback) => {
        try {
          callback?.(userData);
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

export default LanyardClient;

export type { StatusData };
