<script lang="ts" setup>
import moment from 'moment'

import { socials } from '~/utils/constants'
import { getRecentProjects, st, sa } from '~/utils/functions'
import type { Option, Status } from '~/utils/types'

import LanyardClient from '~/lib/lanyard'
import type { StatusData } from '~/lib/lanyard/types'

const lanyard = new LanyardClient()
const config = useRuntimeConfig()

const age = moment().diff(config.public.DATE_OF_BIRTH as string, 'years')
const status: Ref<Option<Status>> = ref(null)

const projects = await getRecentProjects()

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
    connectSocket()
  })
}

connectSocket()
</script>

<template>
  <div>
    <div class="screen flex-col justify-around">
      <div>
        <h1 class="no-underline">
          Halla! I'm
          <span class="text-highlight font-extrabold">faaz</span>.
        </h1>
        <p class="pb-3 md:w-4/6">
          I am a {{ age }} year old full-stack developer from the United Arab
          Emirates who loves programming both professionally and as a hobby.
        </p>

        <div class="flex items-center spaced-items">
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

      <div class="flex justify-end">
        <div class="flex flex-col text-right">
          <h1>About</h1>
          <div>
            <p v-if="status" class="flex justify-end">
              I'm currently
              <span class="text font-extrabold px-1">
                {{ status.status }}
              </span>
            </p>

            <div v-else class="animate-pulse h-5 w-full bg-gray-700 rounded" />

            <p v-if="status?.spotify">
              <VMenu placement="top" theme="glass">
                Listening to
                <a
                  class="text font-extrabold"
                  :href="st(status.spotify.track_id)"
                >
                  {{ status.spotify.song }}
                </a>

                <template #popper>
                  <SpotifyEmbed :spotify="status.spotify" />
                </template>

                by
                <a
                  class="text font-extrabold"
                  :href="sa(status.spotify.artists[0])"
                >
                  {{ status.spotify.artists[0] }}
                </a>.
              </VMenu>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="screen flex-col justify-around">
      <div>
        <h1>Expertise</h1>
        <p class="md:w-4/6">
          Proficient in
          <a href="https://www.python.org">Python</a>
          and
          <a href="https://en.wikipedia.org/wiki/JavaScript">Javascript</a>,
          with expertise in data analysis, machine learning and web development.
          I'm currently learning
          <a href="https://www.rust-lang.org">Rust</a>
          for its speed, memory safety, and concurrency features for systems
          programming.
        </p>

        <div class="flex mt-3 spaced-items">
          <PythonLogo />
          <JavascriptLogo />
          <RustLogo />
          <VueLogo />
          <TailwindLogo />
          <PostgreSQLLogo />
          <RedisLogo />
        </div>
      </div>

      <div class="flex pt-16 md:pt-6 flex-col justify-end text-right">
        <h1>Projects</h1>
        <p>
          I maintain a bunch of projects over at my
          <a href="https://github.com/du-cki">GitHub</a>. Here are some of my
          recent contributions:
        </p>

        <div class="flex flex-col lg:flex-row pt-3">
          <ProjectCard v-for="project in projects" :key="project.repo_name" class="mr-2" :project="project" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  @apply w-screen min-h-[100dvh] flex p-10 md:p-20;
}

.spaced-items > * {
  @apply mr-3;
}

a > svg {
  @apply transition-all hover:opacity-80;
}
</style>
