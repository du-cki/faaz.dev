<script lang="ts" setup>
import moment from 'moment'

import { getRecentProjects, sp } from '~/utils/functions'
import type { Status } from '~/utils/types'

import LanyardClient from '~/lib/lanyard'
import type { StatusData } from '~/lib/lanyard/types'

const config = useRuntimeConfig()

const age = moment().diff(config.public.DATE_OF_BIRTH as string, 'years')
const projects = await getRecentProjects()

const status: Ref<Status> = ref({})

const lanyard = new LanyardClient()
const socket = lanyard.subscribe([
  config.public.USER_ID
])

socket.addEventListener('message', ({ data: str }) => {
  let { d }: { d: StatusData } = JSON.parse(str)

  // @ts-ignore
  if (d[config.public.USER_ID]) {
    // @ts-ignore
    d = d[config.public.USER_ID]
  }

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

        <div class="flex w-fit items-center spaced-items">
          <a v-tooltip="'@du-cki'" href="https://github.com/du-cki" class="ml-1">
            <GithubLogo />
          </a>
          <a v-tooltip="'@du_cki'" href="https://discord.com/users/651454696208465941">
            <DiscordLogo />
          </a>
          <a v-tooltip="'meow@faaz.dev'" href="mailto:meow@faaz.dev">
            <MailLogo />
          </a>
          <a v-tooltip="'Public Key'" href="/key.pbk">
            <KeyLogo />
          </a>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="flex flex-col text-right">
          <h1>About</h1>
          <div>
            <p v-if="status.status" class="flex justify-end">
              I'm currently
              <span class="text font-extrabold px-1">
                {{ status.status }}
              </span>
            </p>
            <div v-else class="animate-pulse h-5 w-40 bg-gray-700 rounded" />

            <p v-if="status.spotify">
              Listening to
              <a
                v-tooltip="{
                  content:
                    '<img height=\'200\' width=\'200\' src=\'' +
                    status.spotify.album_art_url +
                    '\'>',
                  html: true,
                }"
                class="text font-extrabold"
                :href="sp(status.spotify.track_id)"
              >
                {{ status.spotify.song }}
              </a>
              by
              <a
                class="text font-extrabold"
                :href="'https://open.spotify.com/search/' +
                  encodeURIComponent(status.spotify.artists[0]) +
                  '/artists'
                "
              >
                {{ status.spotify.artists[0] }}
              </a>
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

.spaced-items>* {
  @apply mr-3;
}
</style>
