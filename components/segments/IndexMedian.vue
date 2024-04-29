<script setup lang="ts">
import { getProjects } from '~/utils/functions'

const projects = ref([])

onMounted(async () => {
  projects.value = await getProjects()
})
</script>

<template>
  <div class="screen flex-col justify-around">
    <div>
      <h1>Expertise</h1>
      <p class="md:w-4/6">
        Proficient in
        <a href="https://www.python.org">Python</a>
        and
        <a href="https://en.wikipedia.org/wiki/JavaScript">Javascript</a>,
        with expertise in data analysis, machine learning and web development.
        I'm currently learning
        <a href="https://www.rust-lang.org">Rust</a>
        for its speed, memory safety, and concurrency features for systems
        programming.
      </p>

      <div class="flex mt-3 gap-3">
        <PythonLogo />
        <JavascriptLogo />
        <RustLogo />
        <VueLogo />
        <TailwindLogo />
        <PostgreSQLLogo />
        <RedisLogo />
      </div>
    </div>

    <div class="flex mt-16 md:mt-14 flex-col justify-end text-right">
      <h1>Projects</h1>
      <p>
        I maintain a bunch of projects over at my
        <a href="https://github.com/du-cki">GitHub</a>. Here are some of my
        recent contributions
      </p>

      <div class="flex flex-col lg:flex-row pt-3 justify-evenly gap-2">
        <ProjectCard v-for="project in projects" :key="project.repo_name" :project="project" />
      </div>

      <div class="text-right">
        <NuxtLink to="/me/projects" class="hover:cursor-pointer no-underline text-sm font-semibold">
          Show More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
