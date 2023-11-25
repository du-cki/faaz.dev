<script setup lang="ts">
import type { Track, Artist } from '../utils/types'

defineProps<{
  item: Track | Artist
}>()
</script>

<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-lg flex p-2 items-center w-full md:w-96 ">
    <img :src="item.image.at(-1)!['#text']" class="rounded-lg w-16 h-16 mr-3">

    <div class="flex w-full items-center justify-between">
      <div>
        <a :href="item.url" class="w-fit text no-underline hover:underline font-extrabold line-clamp-1">
          {{ item.name }}
        </a>

        <!-- @vue-skip -->
        <p v-if="item.artist" class="line-clamp-1">
          by
          <span class="text font-extrabold">
            {{ item.artist }}
          </span>
        </p>
      </div>

      <p v-if="item.playcount" class="bg-cyan-600 text py-0.5 w-1/4 mr-1 rounded-lg font-extrabold text-xs text-center">
        {{ `${item.playcount} PLAYS` }}
      </p>
    </div>
  </div>
</template>