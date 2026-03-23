import type { APIRoute } from "astro";

import { github, GITHUB_USERNAME } from "../../../utils/constants";

export const GET: APIRoute = async (request) => {
  const projects = await github.getRepositories(GITHUB_USERNAME, {
    type: "owner",
    sort: "updated",
    per_page: "8",
  });

  const filtered = projects
    .filter((project) => !project.fork)
    .filter((project) => !!project.description)
    .sort((project) => project.stars)
    .slice(-4);

  request.cache.set({
    maxAge: 60 * 60,
    tags: ["api", "projects"],
  });

  return Response.json(filtered);
};

export const prerender = false;
