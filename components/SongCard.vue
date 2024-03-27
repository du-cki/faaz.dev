<script setup lang="ts">
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
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-lg flex p-2 items-center m-1 w-full md:w-96">
    <img
      ref="coverImage"
      class="rounded-lg w-20 h-16 mr-3"
      loading="lazy"
      :class="{'animate-pulse bg-gray-600': type === 'skeletal'}"
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
