<script setup lang="ts">
import type { SongsResponse } from '~/utils/types'

const req = await fetch('/api/songs')
if (!req.ok) { throw new Error('Failed to fetch songs') }

const data: SongsResponse = await req.json()
</script>

<template>
  <div class="p-10 md:p-20">
    <h2 class="flex gap-1 text-gray-400">
      ( Last Updated
      <FormatTime :timestamp="data.last_updated_at" />)
    </h2>

    <div>
      <h1 class="font-semibold">
        Recently Played
      </h1>

      <div class="flex flex-wrap justify-between">
        <SongCard v-for="song in data.recentTracks" :key="song.url" class="m-1" :item="song" />
      </div>
    </div>

    <div class="pt-10">
      <h1 class="font-semibold">
        Top Tracks
        <span class="text-gray-500 text-sm">
          (of the week)
        </span>
      </h1>

      <div class="flex flex-wrap justify-between">
        <SongCard v-for="song in data.topTracks" :key="song.url" class="m-1" :item="song" />
      </div>
    </div>

    <div class="pt-10">
      <h1 class="font-semibold">
        Top Artists
        <span class="text-gray-500 text-sm">
          (of the week)
        </span>
      </h1>

      <div class="flex flex-wrap justify-between">
        <SongCard v-for="song in data.topArtists" :key="song.url" class="m-1" :item="song" />
      </div>
    </div>
  </div>
</template>
