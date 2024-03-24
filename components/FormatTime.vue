<script setup lang="ts">
import moment from 'moment'

import type { Option } from '~/utils/types'

const props = defineProps<{
  timestamp: number;
}>()

const time = moment(props.timestamp)
const formattedTime = ref<string>(time.fromNow())

let activeInterval: Option<NodeJS.Timer> = null

onMounted(() => {
  activeInterval = setInterval(() => {
    formattedTime.value = time.fromNow()
  }, 2000)
})

onUnmounted(() => {
  if (activeInterval) { clearInterval(activeInterval) }
})
</script>

<template>
  <p
    ref="parent"
    v-tooltip="time.format('LLLL')"
    class="bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit px-1 font-medium"
  >
    {{ formattedTime }}
  </p>
</template>
