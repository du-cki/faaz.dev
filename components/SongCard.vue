<script setup lang="ts">
import type { Track, Artist } from '../utils/types'

const props = defineProps<{
  item: Track | Artist
  type: 'track' | 'artist'
}>()

const url = props.type === 'track'
  ? `/api/images/${encodeURIComponent(props.item?.artist)}/${encodeURIComponent(props.item?.name)}`
  : `/api/images/${encodeURIComponent(props.item?.name)}`
</script>

<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-lg flex p-2 items-center w-full md:w-96 ">
    <img
      :src="url"
      class="rounded-lg w-16 h-16 mr-3"
      alt="Cover Image"
      loading="lazy"
      height="64px"
      width="64px"
    >

    <div class="flex w-full items-center justify-between ">
      <div :class="`flex flex-col ${item.playcount ? 'w-3/4' : 'w-full'}`">
        <a :href="item.url" class="text hover:underline font-extrabold line-clamp-1 w-fit">
          {{ item.name }}
        </a>

        <p v-if="item?.artist!" class="line-clamp-1 ">
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
