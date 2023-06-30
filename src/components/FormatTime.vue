<script lang="ts">
import moment from 'moment'

import 'floating-vue/dist/style.css' // the tooltip css.

export default {
  data () {
    const time = moment(this.timestamp * 1000)

    return {
      time
    }
  },

  mounted () {
    const elem = this.$refs.parent as HTMLElement
    elem.innerHTML = this.time.fromNow() // so it doesn't take a second to be set initially,

    setInterval(() => {
      elem.innerHTML = this.time.fromNow()
    }, 1000)
  },

  props: [
    'timestamp'
  ]
}
</script>

<template>
  <p
    ref="parent"
    class="bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit px-1"
    v-tooltip="time.format('LLLL')"
  />
</template>
