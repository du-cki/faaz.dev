<script setup lang="ts">
import type { SongsResponse } from '~/utils/types'

useSeoMeta({
  title: 'Songs - faaz.dev',
  ogTitle: 'Songs - faaz.dev'
})

const req = await fetch('/api/songs')
if (!req.ok) { throw new Error('Failed to fetch songs') }

const data: SongsResponse = await req.json()

const categories = [
  {
    name: 'Recently Played',
    items: data.recentTracks,
    type: 'track'
  },
  {
    name: 'Top Tracks',
    subText: '(of the week)',
    items: data.topTracks,
    type: 'track'
  },
  {
    name: 'Top Artists',
    subText: '(of the week)',
    items: data.topArtists,
    type: 'artist'
  }
]

</script>

<template>
  <div class="p-10 md:p-20">
    <h2 class="flex gap-1 text-gray-400 py-3">
      (
      Last Updated
      <FormatTime :timestamp="data.last_updated_at" class="text-base" />
      )
    </h2>

    <div v-for="category in categories" :key="category.name" class="pt-10">
      <h1 class="font-semibold">
        {{ category.name }}
        <span v-if="category.subText" class="text-gray-500 text-sm">
          {{ category.subText }}
        </span>
      </h1>

      <div class="flex flex-wrap justify-between">
        <SongCard v-for="song in category.items" :key="song.url" class="m-1" :item="song" :type="category.type" />
      </div>
    </div>
  </div>
</template>
