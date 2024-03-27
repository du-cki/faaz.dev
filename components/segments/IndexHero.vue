<script setup lang="ts">
import moment from 'moment'

import { st, sa } from '~/utils/functions'
import { socials } from '~/utils/constants'

import LanyardClient from '~/lib/lanyard'
import type { StatusData } from '~/lib/lanyard/types'

import type { Option, Status } from '~/utils/types'

const lanyard = new LanyardClient()

const config = useRuntimeConfig()
const age = moment().diff(config.public.DATE_OF_BIRTH as string, 'years')

const status: Ref<Option<Status>> = ref(null)

let connectedSocket: Option<WebSocket>

const connectSocket = () => {
  const socket = lanyard.subscribe([
    config.public.USER_ID
  ])

  socket.addEventListener('message', ({ data: str }) => {
    const msg: { op: number, d: StatusData } = JSON.parse(str)

    if (msg.op !== 0) { return }

    let d = msg.d
    // @ts-ignore
    if (d[config.public.USER_ID]) {
      // @ts-ignore
      d = d[config.public.USER_ID]
    }

    if (status.value == null) { status.value = {} }

    const isOnline = d.active_on_discord_desktop || d.active_on_discord_mobile || d.active_on_discord_web
    status.value.status = isOnline ? 'online' : 'offline'

    if (d.listening_to_spotify) {
      const spotify = d.spotify

      status.value.spotify = {
        ...spotify,
        artists: spotify.artist.split('; ')
      }
    } else {
      status.value.spotify = null
    }
  })

  socket.addEventListener('close', () => {
    status.value = null
    connectedSocket = null
    connectSocket()
  })

  connectedSocket = socket
}

onMounted(() => {
  connectSocket()
})

onUnmounted(() => {
  connectedSocket?.close()
})
</script>

<template>
  <div class="screen flex-col justify-around">
    <div>
      <h1 class="no-underline">
        Halla! I'm
        <span class="text-highlight font-extrabold">Faaz</span>.
      </h1>

      <p class="pb-3 md:w-4/6">
        I am a {{ age }} year old full-stack developer from the United Arab
        Emirates who loves programming both professionally and as a hobby.
      </p>

      <div class="flex items-center gap-3">
        <a
          v-for="social in socials"
          :key="social.url"
          v-tooltip="social.hoverText"
          :href="social.url"
        >
          <component :is="social.icon" />
        </a>
      </div>
    </div>

    <div class="text-right">
      <h1>About</h1>
      <p>
        I'm currently
        <span v-if="status" class="text font-extrabold">
          {{ status.status }}
        </span>
        <span v-else class="h-10 w-24 animate-pulse after:content-['Loading...']" />
      </p>

      <div v-if="status?.spotify" class="flex flex-wrap items-center justify-end gap-1">
        <p>Listening to</p>

        <VMenu placement="top-end" theme="glass" class="flex items-center">
          <a
            class="text font-extrabold"
            :href="st(status.spotify.track_id)"
          >
            {{ status.spotify.song }}
          </a>

          <template #popper>
            <SpotifyEmbed :spotify="status.spotify" />
          </template>
        </VMenu>

        <p>by</p>
        <a
          class="text font-extrabold"
          :href="sa(status.spotify.artists[0])"
        >
          {{ status.spotify.artists[0] }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
a > svg {
  @apply transition-all hover:opacity-80;
}
</style>
