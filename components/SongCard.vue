<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { Track, Artist } from '~/utils/types'

const props = defineProps<{
  item: Track | Artist | {}
  type: 'track' | 'artist' | 'skeletal'
}>()

let url = props.item?.image?.at(-1)?.['#text'] || null

if (url === LAST_FM_PLACEHOLDER_IMAGE) {
  url = props.type === 'track'
    ? `/api/images/${encodeURIComponent(props.item?.artist)}/${encodeURIComponent(props.item?.name)}`
    : `/api/images/${encodeURIComponent(props.item?.name)}`
}
</script>

<template>
  <div
    :class="twMerge(
      'flex items-center w-full md:w-96 lg:w-80 rounded-lg p-2',
      'bg-light-secondary dark:bg-dark-secondary'
    )"
  >
    <img
      ref="coverImage"
      class="rounded-lg w-20 h-16 mr-3"
      loading="lazy"
      :class="twMerge(type === 'skeletal' && 'animate-pulse bg-gray-600 border-2 border-gray-300 dark:border-gray-700' )"
      :src="url"
    >

    <div class="w-full">
      <div class="flex w-full items-center justify-between">
        <div
          class="flex flex-col w-full"
          :class="{'w-3/4': item.playcount}"
        >
          <a
            v-if="item.url"
            :href="item.url"
            class="text hover:underline font-extrabold line-clamp-1 w-fit"
          >
            {{ item.name }}
          </a>

          <div v-else-if="type === 'skeletal'" class="bg-gray-600 py-2 mb-3 w-3/4 rounded-lg" />

          <p v-if="item.artist" class="line-clamp-1">
            by
            <span class="text font-extrabold">
              {{ item.artist }}
            </span>
          </p>

          <div v-else-if="type === 'skeletal'" class="bg-gray-600 py-2 w-1/4 rounded-lg" />
        </div>

        <span v-if="item.playcount" class="bg-cyan-600 w-1/4 rounded-lg font-extrabold text-xs text text-center p-1">
          {{ item.playcount }}
        </span>
      </div>
    </div>
  </div>
</template>
