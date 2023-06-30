<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";

import "floating-vue/dist/style.css"; // the tooltip css.
import Wrapper from "../components/Wrapper.vue";
import ProjectCard from "../components/ProjectCard.vue";
import FormatTime from "../components/FormatTime.vue";

import type { ListRepositoryPayload, Project, Song, Status } from "../types";
import { EventType } from "../types";

export default defineComponent({
  data() {
    return {
      connection: null as WebSocket | null,
      songData: null as Song | null,
      projects: [] as Project[],
      userStatus: null as Status | null,
      age: moment().diff(import.meta.env.VITE_DATE_OF_BIRTH, "years"),
      // this is just a basic mapping of language: color,
      // its main purpose is cosmetic only but i'd like to get a better solution in the future.
      color_mapping: {
        rust: "#C36241",
        python: "#FFD43B",
        html: "#E34C26",
        javascript: "#F0DB4F",
        typescript: "#3178C6",
        vue: "#41B883",
      },
    };
  },
  mounted() {
    const baseUrl = import.meta.env.VITE_IS_DEV
      ? "ws://127.0.0.1:8000/ws/meow"
      : `wss://${import.meta.env.VITE_APP_BACKEND}/ws/meow`;

    this.connection = new WebSocket(baseUrl);

    this.connection.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      // the break statements are not required at all since it should
      // be propagated to the "default" case but it doesn't for some reason.
      switch (message.event) {
        case EventType.Spotify:
          this.songData = message.data.song; break;
        case EventType.Status:
          this.userStatus = message.data; break;
        default:
          console.error(`Got an unexpected event:`, message);
      }
    };

    this.connection.onclose = (_error: Event) => {
      console.error('Got disconnected, clearing state and attempting to reconnect...'); // TODO: turn this into a toast
      this.songData = null;
      this.userStatus = null;
    }
  },
  unmounted() {
    this.connection?.close();
  },
  components: {
    Wrapper,
    ProjectCard,
    FormatTime,
  },
  computed: {
    getRecentRepositories() {
      fetch(
        "https://api.github.com/users/du-cki/repos?type=owner&sort=updated&per_page=3"
      )
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(
              `Could not react GitHub, request returned a ${response.status}`
            );
          }

          return response.json();
        })
        .then((data: ListRepositoryPayload[]) => {
          data.forEach((elem) => {
            this.projects.push({
              homepage: elem.homepage,
              repo_url: elem.html_url,
              repo_name: elem.name,
              owner: elem.owner?.login,
              owner_url: elem.owner?.html_url,
              description: elem.description,
              stars: elem.stargazers_count,
              license_id: elem.license?.spdx_id,
              license: elem.license?.name,
              language: elem.language || "Other",
              color:
                this.color_mapping[
                elem.language!.toLowerCase() as keyof typeof this.color_mapping
                ] || import.meta.env.VITE_PROJECT_DEFAULT_COLOR, // sometimes color is null for whatever reason.
              tags: elem.topics,
            });
          });
        });

      return this.projects;
    },
  },
});
</script>

<template>
  <Wrapper>
    <div class="w-screen h-screen flex flex-col items-center justify-around md:justify-center">
      <div class="w-screen p-10 md:p-20">
        <h1>
          Hello! I'm
          <span class="text-highlight">faaz</span>.
        </h1>
        <p class="text-gray-500 md:w-4/6">
          I am a {{ age }} year old self-taught backend developer from the
          <span v-tooltip="'🇦🇪'" class="uae-flag-text animated-gradient">
            United Arab Emirates
          </span>
          who loves programming both professionally and as a hobby.
        </p>
        <div class="flex pt-3">
          <a href="https://github.com/du-cki" v-tooltip="'du-cki'" target="_blank">
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" mlns="http://www.w3.org/2000/svg">
              <path
                d="M9.29183 21V18.4407L9.3255 16.6219C9.36595 16.0561 9.58639 15.5228 9.94907 15.11C9.95438 15.1039 9.95972 15.0979 9.9651 15.0919C9.9791 15.0763 9.96988 15.0511 9.94907 15.0485V15.0485C7.52554 14.746 5.0005 13.7227 5.0005 9.26749C4.9847 8.17021 5.3427 7.10648 6.00437 6.27215C6.02752 6.24297 6.05103 6.21406 6.07492 6.18545V6.18545C6.10601 6.1482 6.11618 6.09772 6.10194 6.05134C6.10107 6.04853 6.10021 6.04571 6.09935 6.04289C6.0832 5.9899 6.06804 5.93666 6.05388 5.88321C5.81065 4.96474 5.86295 3.98363 6.20527 3.09818C6.20779 3.09164 6.21034 3.08511 6.2129 3.07858C6.22568 3.04599 6.25251 3.02108 6.28698 3.01493V3.01493C6.50189 2.97661 7.37036 2.92534 9.03298 4.07346C9.08473 4.10919 9.13724 4.14609 9.19053 4.18418V4.18418C9.22901 4.21168 9.27794 4.22011 9.32344 4.20716C9.32487 4.20675 9.32631 4.20634 9.32774 4.20593C9.41699 4.18056 9.50648 4.15649 9.59617 4.1337C11.1766 3.73226 12.8234 3.73226 14.4038 4.1337C14.4889 4.1553 14.5737 4.17807 14.6584 4.20199C14.6602 4.20252 14.6621 4.20304 14.6639 4.20356C14.7174 4.21872 14.7749 4.20882 14.8202 4.17653V4.17653C14.8698 4.14114 14.9187 4.10679 14.967 4.07346C16.6257 2.92776 17.4894 2.9764 17.7053 3.01469V3.01469C17.7404 3.02092 17.7678 3.04628 17.781 3.07946C17.7827 3.08373 17.7843 3.08799 17.786 3.09226C18.1341 3.97811 18.1894 4.96214 17.946 5.88321C17.9315 5.93811 17.9159 5.9928 17.8993 6.04723V6.04723C17.8843 6.09618 17.8951 6.14942 17.9278 6.18875C17.9289 6.18998 17.9299 6.19121 17.9309 6.19245C17.9528 6.21877 17.9744 6.24534 17.9956 6.27215C18.6573 7.10648 19.0153 8.17021 18.9995 9.26749C18.9995 13.747 16.4565 14.7435 14.0214 15.015V15.015C14.0073 15.0165 14.001 15.0334 14.0105 15.0439C14.0141 15.0479 14.0178 15.0519 14.0214 15.0559C14.2671 15.3296 14.4577 15.6544 14.5811 16.0103C14.7101 16.3824 14.7626 16.7797 14.7351 17.1754V21"
                stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M4 17C4.36915 17.0523 4.72159 17.1883 5.03065 17.3975C5.3397 17.6068 5.59726 17.8838 5.7838 18.2078C5.94231 18.4962 6.15601 18.7504 6.41264 18.9557C6.66927 19.161 6.96379 19.3135 7.27929 19.4043C7.59478 19.4952 7.92504 19.5226 8.25112 19.485C8.5772 19.4475 8.89268 19.3457 9.17946 19.1855"
                stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a href="https://discord.com/users/651454696208465941" v-tooltip="'@du_cki'" class="px-2" target="_blank">
            <svg width="40px" height="40px" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"
                d="m68 138-8 16c-10.19-4.246-20.742-8.492-31.96-15.8-3.912-2.549-6.284-6.88-6.378-11.548-.488-23.964 5.134-48.056 19.369-73.528 1.863-3.334 4.967-5.778 8.567-7.056C58.186 43.02 64.016 40.664 74 39l6 11s6-2 16-2 16 2 16 2l6-11c9.984 1.664 15.814 4.02 24.402 7.068 3.6 1.278 6.704 3.722 8.567 7.056 14.235 25.472 19.857 49.564 19.37 73.528-.095 4.668-2.467 8.999-6.379 11.548-11.218 7.308-21.769 11.554-31.96 15.8l-8-16m-68-8s20 10 40 10 40-10 40-10" />
              <ellipse cx="71" cy="101" fill="#000000" rx="13" ry="15" />
              <ellipse cx="121" cy="101" fill="#000000" rx="13" ry="15" />
            </svg>
          </a>
          <a href="mailto:meow@faaz.dev" v-tooltip="'meow@faaz.dev'" target="_blank">
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
              <rect x="3" y="5" width="18" height="14" rx="2" stroke-width="2" stroke-linecap="round" />
            </svg>
          </a>
          <a href="/key.pbk" class="px-2" v-tooltip="'Public Key'" target="_blank">
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.25 7C18.25 7.69036 17.6904 8.25 17 8.25C16.3096 8.25 15.75 7.69036 15.75 7C15.75 6.30964 16.3096 5.75 17 5.75C17.6904 5.75 18.25 6.30964 18.25 7Z"
                fill="#212121" />
              <path
                d="M15.5 2.04999C11.8857 2.04999 8.94995 4.98577 8.94995 8.59999C8.94995 8.9872 9.00013 9.36035 9.06042 9.704C9.07822 9.80547 9.04566 9.89362 8.99119 9.94809L2.75541 16.1839C2.23968 16.6996 1.94995 17.3991 1.94995 18.1284V20.3C1.94995 21.2665 2.73345 22.05 3.69995 22.05H6.19995C7.16645 22.05 7.94995 21.2665 7.94995 20.3V19.05H9.69995C10.3903 19.05 10.95 18.4903 10.95 17.8V16.05H12.7C13.3748 16.05 13.9248 15.5151 13.9491 14.8462C14.4458 14.974 14.9696 15.05 15.5 15.05C19.1142 15.05 22.0499 12.1142 22.0499 8.49999C22.0499 4.86884 19.097 2.04999 15.5 2.04999ZM10.45 8.59999C10.45 5.8142 12.7142 3.54999 15.5 3.54999C18.3029 3.54999 20.5499 5.73114 20.5499 8.49999C20.5499 11.2858 18.2857 13.55 15.5 13.55C14.8206 13.55 14.1213 13.3789 13.4954 13.1106C13.2637 13.0113 12.9976 13.0351 12.7871 13.1739C12.5766 13.3126 12.45 13.5479 12.45 13.8V14.55H10.7C10.0096 14.55 9.44995 15.1096 9.44995 15.8V17.55H7.69995C7.00959 17.55 6.44995 18.1096 6.44995 18.8V20.3C6.44995 20.4381 6.33802 20.55 6.19995 20.55H3.69995C3.56188 20.55 3.44995 20.4381 3.44995 20.3V18.1284C3.44995 17.7969 3.58165 17.479 3.81607 17.2445L10.0518 11.0087C10.4702 10.5904 10.6356 10.002 10.5379 9.44479C10.4842 9.13883 10.45 8.86239 10.45 8.59999Z"
                fill="#212121" />
            </svg>
          </a>
        </div>
      </div>

      <div class="w-screen p-10 md:p-20">
        <div class="flex justify-end items-center h-full">
          <div class="text-right">
            <h1 class="text-right">About</h1>
            
            <!-- I hate what I'm doing here but I'm not thinking straight right now -->
            <!-- So I'll just leave it be. -->
            <p v-if="userStatus" class="flex justify-end text-right">
              I'm currently
              <span class="text-black dark:text-white font-extrabold mx-1">
                {{ userStatus.status !== 'offline' ? ' online' : ' offline' }}
              </span>
              <span v-if="userStatus.status === 'offline'" class="flex">
                (last seen
                <FormatTime :timestamp="userStatus.last_online" class="ml-1" />)
              </span>
            </p>

            <p v-if="songData">
              Listening to
              <a class="text-black dark:text-white font-bold" :href="songData.track_url" v-tooltip="{
                content:
                  '<img height=\'200\' width=\'200\' src=\'' +
                  songData.track_image +
                  '\'>',
                html: true,
                theme: 'album-cover',
              }" targeti="_blank">{{ songData.title }}</a>
              by
              <a :href="'https://open.spotify.com/search/' + encodeURIComponent(songData.artists[0]) + '/artists'"
                class="text-black dark:text-white font-bold hover:text-highlight hover:cursor-pointer">
                <!-- due to the backend not returning an artist url, this will do. -->
                {{ songData.artists[0] }}
              </a>.
            </p>
            
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-evenly md:h-screen p-10 md:p-20 md:py-10">
      <div>
        <h1>Expertise</h1>
        <p class="md:w-4/6">
          Proficient in
          <a href="https://www.python.org" target="_blank">Python</a>
          and
          <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank">Javascript</a>,
          <!-- cuz idk where else to link javascript too -->
          with expertise in data analysis, machine learning and web development.
          I'm currently learning
          <a href="https://www.rust-lang.org" target="_blank">Rust</a>
          for its speed, memory safety, and concurrency features for systems
          programming.
        </p>
      </div>

      <div class="flex justify-end items-center pt-14 lg:pt-20 w-full">
        <div class="text-right w-full">
          <h1>Projects</h1>
          <p>
            I work and maintain on a few projects over at
            <a href="https://github.com/du-cki" v-tooltip="'@du-cki'">GitHub</a>, here are my recent Projects
          </p>
          <div class="base flex-col lg:flex-row lg:pt-10 pt-3 w-full">
            <svg v-if="!projects.length" class="pt-6" xmlns="http://www.w3.org/2000/svg" height="100px" width="100px"
              viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
              <circle stroke="none" cx="6" cy="50" r="6">
                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15"
                  repeatCount="indefinite" begin="0.1" />
              </circle>
              <circle stroke="none" cx="30" cy="50" r="6">
                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10"
                  repeatCount="indefinite" begin="0.2" />
              </circle>
              <circle stroke="none" cx="54" cy="50" r="6">
                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5"
                  repeatCount="indefinite" begin="0.3" />
              </circle>
            </svg>

            <ProjectCard v-for=" project  in  getRecentRepositories " :key="project.repo_name" :data="project" />
          </div>
        </div>
      </div>
    </div>

    <div class="base">
      <p class="py-2">
        @ 2022
        <a href="https://github.com/du-cki" target="_blank">du-cki</a>. All
        rights reserved.
      </p>
    </div>
  </Wrapper>
</template>

<style>
.base {
  @apply flex justify-center items-center;
}
</style>
