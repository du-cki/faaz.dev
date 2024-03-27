<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="bg-dark-mode text-white py-16 px-10 w-full flex justify-between">
    <div class="w-2/4">
      <p class="text-gray-400 font-extrabold">/me/</p>
      <h1 class="text-8xl font-extrabold p-0 m-0">{{ title }}</h1>
      <p class="mt-5 text-2xl font-semibold text-gray-300">
        {{ description }}
      </p>
    </div>

    <div class="bg-yellow-300 rounded-full p-3">
      <img src="/original_favicon.png" />
    </div>
  </div>
</template>
