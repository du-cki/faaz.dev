<script setup lang="ts">
const props = defineProps<{
  title: string,
  description: string
}>()

useSeoMeta({
  title: `${props.title} - faaz.dev`,
  ogTitle: props.title
})

defineOgImageComponent('MePage', {
  title: props.title,
  description: props.description
})
</script>

<template>
  <div class="p-10 md:p-20">
    <NuxtLink to="/" class="hover:cursor-pointer no-underline text-sm my-10 font-extrabold">
      Go Back
    </NuxtLink>

    <div class="my-10">
      <p>/me/</p>
      <h1 class="text-5xl">
        {{ title }}
      </h1>
      <p class="w-3/4">
        {{ description }}
      </p>
    </div>

    <slot />
  </div>
</template>
