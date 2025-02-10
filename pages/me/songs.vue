<script setup lang="ts">
import type { SongsResponse } from '~/utils/types'

useSeoMeta({
  title: 'Songs - faaz.dev',
  ogTitle: 'Songs - faaz.dev'
})

const categories = ref([
  {
    name: 'Recently Played',
    items: [],
    type: 'track'
  },
  {
    name: 'Top Track Plays',
    subText: '(of the week)',
    items: [],
    type: 'track'
  },
  {
    name: 'Top Artist Plays',
    subText: '(of the week)',
    items: [],
    type: 'artist'
  }
])

const lastUpdatedAt = ref(null)

onMounted(async () => {
  const req = await fetch('/api/songs')
  if (!req.ok) { throw new Error('Failed to fetch songs') }

  const data: SongsResponse = await req.json()

  categories.value[0].items = data.recentTracks
  categories.value[1].items = data.topTracks
  categories.value[2].items = data.topArtists
  lastUpdatedAt.value = data.last_updated_at
})
</script>

<template>
  <MeBase
    title="Songs"
    description="My latest music activity on LastFM."
  >
    <div v-for="category in categories" :key="category.name" class="pt-10">
      <h1 class="font-bold text-3xl">
        {{ category.name }}
        <span v-if="category.subText" class="text-gray-500 text-sm font-semibold">
          {{ category.subText }}
        </span>
      </h1>

      <div
        v-if="category.items.length > 0"
        class="flex flex-wrap gap-3"
      >
        <SongCard
          v-for="song in category.items"
          :key="song.url"
          :item="song"
          :type="category.type"
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
    </div>
  </MeBase>
</template>
