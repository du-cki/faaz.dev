<script lang="ts" setup>
useSeoMeta({
  title: 'Home - faaz.dev',
  ogTitle: 'Home - faaz.dev'
})
</script>

<template>
  <div>
    <IndexHero />
    <IndexMedian />
    <IndexMusic />
  </div>
</template>

<style scoped>
.screen {
  @apply w-screen supports-[height:100dvh]:min-h-[100dvh] min-h-screen flex p-10 md:p-20;
}
</style>
