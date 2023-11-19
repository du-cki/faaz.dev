import { StatusResponse } from './types'

class LanyardClient {
  subscribe (users: string[]) {
    const socket = new WebSocket('wss://api.lanyard.rest/socket')

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

  async get_status (user: string): Promise<StatusResponse> {
    const req = await fetch(`https://api.lanyard.rest/v1/users/${user}`)

    if (!req.ok) {
      throw new Error(
        `Could not react Lanyard, request returned a ${req.status}: ${req.statusText}`
      )
    }

    return await req.json()
  }
}

export default LanyardClient
