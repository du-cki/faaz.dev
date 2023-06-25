<script lang="ts">
export default {
  mounted() {
    const wrapper = this.$refs.parent as HTMLElement;

    const children = wrapper.children;

    for (let i = 0; i < children.length; i++) {
      // in a way this is like enumerating.
      if (i % 2 === 0) {
        children[i].classList.add("bg-light-primary", "dark:bg-dark-primary");
      } else {
        children[i].classList.add(
          "bg-light-secondary",
          "dark:bg-dark-secondary"
        );
      }
    }
  },
};
</script>

<template>
  <div ref="parent">
    <slot />
  </div>
</template>
