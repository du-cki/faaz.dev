import type { APIRoute } from "astro";

import { github, GITHUB_USERNAME } from "@/utils/constants";

export const GET: APIRoute = async (request) => {
  const projects = await github.searchRepositories(
    `user:${GITHUB_USERNAME}&sort=stars&order=desc`,
  );

  const filtered = projects
    .filter((project) => !project.fork)
    .filter((project) => !!project.description)
    .slice(0, 4);

  request.cache.set({
    maxAge: 60 * 60,
    tags: ["api", "projects"],
  });

  return Response.json(filtered);
};

export const prerender = false;
