<script setup lang="ts">
import type { SongsResponse } from '~/utils/types'

const songs: Ref<SongsResponse['recentTracks']> = ref([])

onMounted(async () => {
  const req = await fetch('/api/songs?minified=true')
  if (!req.ok) { throw new Error('Failed to fetch songs') }

  const data: SongsResponse = await req.json()
  songs.value = data.recentTracks
})
</script>

<template>
  <div class="screen h-max flex-col">
    <h1>Music</h1>
    <p class="md:w-4/6 mb-5">
      I'm a big fan of music! I enjoy listening to a wide range of genres and songs. Here are the tracks I've been listening to lately.
    </p>

    <div
      v-if="songs.length > 0"
      class="flex flex-wrap gap-3"
    >
      <SongCard
        v-for="song in songs"
        :key="song.url"
        :item="song"
        :type="'track'"
      />
    </div>

    <div
      v-else
      class="flex flex-wrap gap-3"
    >
      <SongCard
        v-for="i in 15"
        :key="i"
        :item="{}"
        :type="'skeletal'"
      />
    </div>

    <div class="text-right">
      <NuxtLink to="/me/songs" class="hover:cursor-pointer no-underline text-sm font-semibold">
        Show More
      </NuxtLink>
    </div>
  </div>
</template>
