<script lang="ts">
import "floating-vue/dist/style.css"; // the tooltip css.

export default {
  props: ["data"],
};
</script>

<template>
  <div
    class="base-color lg:hover:scale-125 transition-all flex my-2 lg:mx-3 py-3 rounded-lg w-full h-full"
  >
    <div class="pl-3 text-left w-full">
      <div class="flex items-center">
        <svg height="16" viewBox="0 0 16 16" version="1.1" width="16">
          <path
            fill="#FFF"
            class="no-outline"
            d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
          />
        </svg>

        <span class="mx-2">
          <a
            :href="data.owner_url"
            class="text-gray-500 hover:text-gray-500 no-underline"
            >{{ data.owner }}/</a
          >
          <a :href="data.repo_url" class="no-underline">{{ data.repo_name }}</a>
        </span>

        <svg
          v-if="data.license"
          v-tooltip="data.license"
          height="16"
          width="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z"
          />
        </svg>
      </div>

      <div class="flex flex-wrap py-2">
        <a
          v-for="(tag, index) in data.tags"
          :key="index"
          :href="`https://github.com/topics/${tag}`"
          class="bg-gray-300 text-black px-2 mr-1 rounded hover:text-black no-underline"
          target="_blank"
        >
          {{ tag }}
        </a>
      </div>

      <p>{{ data.description }}</p>

      <div class="pt-3 flex items-center justify-between w-full">
        <div class="w-full flex items-center">
          <div
            class="w-3 h-3 mr-2 rounded-full"
            :style="{ backgroundColor: data.color }"
          />
          {{ data.language }}
        </div>

        <div class="flex items-center justify-end mr-3 flex-row w-full">
          <a
            :href="`https://github.com/${data.owner}/${data.repo_name}/stargazers`"
            target="_blank"
            class="pr-2"
          >
            <svg height="16" width="16" viewBox="0 0 16 16">
              <path
                d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"
              />
            </svg>
          </a>
          {{ data.stars }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-color {
  @apply bg-[#EEEEEE] hover:bg-[#E1E1E1] dark:bg-[#0C0909] dark:hover:bg-[#000000];
}

path {
  @apply fill-dark-secondary dark:fill-light-secondary stroke-none;
}

a > svg:hover > path {
  @apply fill-highlight stroke-none;
}
</style>
