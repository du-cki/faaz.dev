<script setup lang="ts">
import type {
  Project
} from '~/utils/types'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div class="flex flex-col justify-around w-full base-color p-2 my-2 rounded-md">
    <div class="flex items-center gap-2">
      <RepositoryLogo />

      <span>
        <a :href="project.owner_url" class="no-underline">
          {{ project.owner }}
        </a>/<a :href="project.repo_url" class="text hover:text-highlight font-bold">
          {{ project.repo_name }}
        </a>
      </span>

      <LicenseLogo v-if="project.license" v-tooltip="project.license" />
    </div>

    <div class="flex flex-wrap py-2">
      <a
        v-for="tag in project.tags"
        :key="tag"
        :href="`https://github.com/topics/${tag}`"
        class="bg-gray-300 text-black hover:text-black px-2 mr-1 rounded no-underline text-base"
        target="_blank"
      >
        {{ tag }}
      </a>
    </div>

    <div class="text-left">
      <p class="text-clip line-clamp-3 text-base">
        {{ project.description }}
      </p>
    </div>

    <div class="flex items-center w-full mt-3">
      <div class="flex items-center w-full">
        <div class="w-3 h-3 mr-2 rounded-full" :style="{ backgroundColor: project.color }" />
        {{ project.language }}
      </div>

      <div class="flex items-center mr-1">
        <a :href="`https://github.com/${project.owner}/${project.repo_name}/stargazers`" target="_blank" class="pr-2">
          <svg height="16" width="16" viewBox="0 0 16 16">
            <path
              d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"
            />
          </svg>
        </a>
        {{ project.stars }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-color {
  @apply bg-[#EEEEEE] dark:bg-[#0C0909];
}

path {
  @apply fill-dark-secondary dark:fill-light-secondary stroke-none;
}

a > svg:hover > path {
  @apply fill-highlight stroke-none;
}
</style>
