<script setup lang="ts">
import moment from 'moment'
import type { Option, Spotify } from '~/utils/types'

const props = defineProps<{
  spotify: Spotify
}>()

// eslint-disable-next-line import/no-named-as-default-member
const fmtTime = (duration: number) => moment.utc(duration).format('mm:ss')

const getProgress = ({ start, end }: { start: number, end: number}) => {
  return {
    start: fmtTime(Date.now() - start),
    end: fmtTime(end - start),
    perc: Math.round(Math.min(((Date.now() - start) / (end - start)) * 100, 100))
  }
}

const progress = ref(getProgress(props.spotify.timestamps))
let activeInterval: Option<NodeJS.Timer> = null

onMounted(() => {
  activeInterval = setInterval(() => {
    progress.value = getProgress(props.spotify.timestamps)
  }, 1000)
})

// clean up after it is unmounted, or else this will be re-rendered
// and will slowly leak memory.
onUnmounted(() => {
  if (activeInterval) { clearInterval(activeInterval) }
})
</script>

<template>
  <div class="flex justify-center items-center p-2 w-96">
    <img :src="spotify.album_art_url" class="h-24 w-24 mr-3 rounded-lg">

    <div class="w-full">
      <span class="text font-extrabold line-clamp-1">
        {{ spotify.song }}
      </span>

      <p class="line-clamp-1 text-sm">
        by
        <span class="text font-extrabold text-base">
          {{ `${spotify.artists.join(', ')}` }}
        </span>
      </p>

      <p class="line-clamp-1 text-sm">
        on
        <span class="text font-extrabold text-base">
          {{ spotify.album }}
        </span>
      </p>

      <div class="mt-2 w-full rounded-full h-1 bg-gray-300 dark:bg-gray-700">
        <div
          class="bg-gray-700 dark:bg-white h-1 rounded-full"
          :style="{ width: `${progress.perc}%` }"
        />
      </div>
      <div class="flex justify-between w-full text-xs pt-1">
        <p class="text font-bold">
          {{ progress.start }}
        </p>
        <p class="text font-bold">
          {{ progress.end }}
        </p>
      </div>
    </div>
  </div>
</template>
