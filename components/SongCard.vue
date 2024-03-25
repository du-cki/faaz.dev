<script setup lang="ts">
import type { Track, Artist } from '../utils/types'

const props = defineProps<{
  item: Track | Artist
  type: 'track' | 'artist'
}>()

let url = props.item?.image.at(-1)?.['#text']

if (url === LAST_FM_PLACEHOLDER_IMAGE) {
  url = props.type === 'track'
    ? `/api/images/${encodeURIComponent(props.item?.artist)}/${encodeURIComponent(props.item?.name)}`
    : `/api/images/${encodeURIComponent(props.item?.name)}`
}
</script>

<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-lg flex p-2 items-center w-full md:w-96">
    <img
      ref="coverImage"
      class="rounded-lg w-20 h-16 mr-3"
      loading="lazy"
      height="64px"
      width="80px"
      :src="url"
    >

    <div class="w-full">
      <div class="flex w-full items-center justify-between">
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

        <p
          v-if="item.playcount"
          class="bg-cyan-600 py-0.5 w-1/4 mx-1 rounded-lg font-extrabold text-xs text text-center"
        >
          {{ `${item.playcount} PLAYS` }}
        </p>
      </div>
    </div>
  </div>
</template>
