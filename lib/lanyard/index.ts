import { StatusResponse, StatusData } from './types'

const BASE_URL = 'api.lanyard.rest'

class LanyardClient {
  subscribe(users: string[]) {
    const socket = new WebSocket(`wss://${BASE_URL}/socket`)

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_ids: users
          }
        })
      )

      setInterval(() => {
        socket.send(
          JSON.stringify({
            op: 3
          })
        )
      }, 30000)
    })

    return socket
  }

  async get_status(user: string): Promise<StatusResponse> {
    const req = await fetch(`https://${BASE_URL}/v1/users/${user}`)

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`)
    }

    return req.json()
  }
}

export default LanyardClient

export type { StatusData }