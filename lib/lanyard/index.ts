import { StatusResponse, StatusData } from "./types";

import { USER_AGENT } from "@/utils/constants";

const BASE_URL = "api.lanyard.rest";

type Callback = (data: StatusData) => unknown;

class LanyardClient {
  callbacks: Callback[];

  constructor() {
    this.callbacks = [];
  }

  subscribe(users: string[]) {
    const socket = new WebSocket(`wss://${BASE_URL}/socket`);

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_ids: users,
          },
        })
      );

      setInterval(() => {
        socket.send(
          JSON.stringify({
            op: 3,
          })
        );
      }, 30000);
    });

    return socket;
  }

  async get_status(user: string): Promise<StatusResponse> {
    const req = await fetch(`https://${BASE_URL}/v1/users/${user}`, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    return req.json();
  }

  add_callback(callback: Callback) {
    this.callbacks.push(callback);
  }

  connect(user: string) {
    const socket = this.subscribe([user]);

    socket.addEventListener("message", ({ data: event }) => {
      const message: { op: number; d: StatusData } = JSON.parse(event);

      if (message.op !== 0) return;

      let data = message.d;
      // @ts-expect-error should be fine
      if (data[user]) {
        // @ts-expect-error should be fine
        data = data[user];
      }

      this.callbacks.forEach((callback) => {
        try {
          callback?.(data);
        } catch (e) {
          console.error(e);
        }
      });
    });

    return socket;
  }
}

export default LanyardClient;

export type { StatusData };
