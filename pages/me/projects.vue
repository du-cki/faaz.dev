<script setup lang="ts">
import { getProjects } from '~/utils/functions'

const projects = ref([])

onMounted(async () => {
  projects.value = await getProjects(0)
})
</script>

<template>
  <MeBase
    title="Projects"
    description="I oversee a range of projects, offering a glimpse into my ongoing contributions. Here, you can delve into some of my recent endeavors."
  >
    <div class="flex flex-col flex-wrap lg:flex-row pt-3 justify-evenly gap-2">
      <ProjectCard v-for="project in projects" :key="project.repo_name" :project="project" />
    </div>
  </MeBase>
</template>
