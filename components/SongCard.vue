<script setup lang="ts">
import type { Track, Artist } from '../utils/types'

defineProps<{
  item: Track | Artist
}>()
</script>

<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-lg flex p-2 items-center w-full md:w-96 ">
    <img :src="item.image.at(-1)!['#text']" class="rounded-lg w-16 h-16 mr-3" height="64px" width="64px">

    <div class="flex w-full items-center justify-between ">
      <div :class="`flex flex-col ${item.playcount ? 'w-3/4' : 'w-full'}`">
        <a :href="item.url" class="text hover:underline font-extrabold line-clamp-1 ">
          {{ item.name }}
        </a>

        <p v-if="item.artist" class="line-clamp-1 ">
          by
          <span class="text font-extrabold">
            {{ item.artist }}
          </span>
        </p>
      </div>

      <p v-if="item.playcount" class="bg-cyan-600 py-0.5 w-1/4 mx-1 rounded-lg font-extrabold text-xs text text-center">
        {{ `${item.playcount} PLAYS` }}
      </p>
    </div>
  </div>
</template>
