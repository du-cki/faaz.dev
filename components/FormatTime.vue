<script setup lang="ts">
import moment from 'moment'

const props = defineProps<{
  timestamp: number
}>()

const time = moment(props.timestamp * 1000)

const parent = ref<HTMLElement | null>(null)

setInterval(() => {
  if (parent.value) {
    parent.value.innerHTML = time.fromNow()
  }
}, 1000)
</script>

<template>
  <p
    ref="parent"
    v-tooltip="time.format('LLLL')"
    class="bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit px-1 font-medium"
  />
</template>
