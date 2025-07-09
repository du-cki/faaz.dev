import { USER_AGENT } from "@/utils/constants";
import { ListRepositoryPayload, Project } from "./types";

class GithubClient {
  async getRepositories(
    user: string,
    options: { type: string; sort: string; per_page: string }
  ): Promise<Project[]> {
    const params = new URLSearchParams(options);

    const req = await fetch(
      `https://api.github.com/users/${user}/repos?${params}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }

    const resp = await req.json();

    return resp.map(
      (data: ListRepositoryPayload): Project => ({
        homepage: data.homepage,
        repo_url: data.html_url,
        repo_name: data.name,
        owner: data.owner?.login,
        owner_url: data.owner?.html_url,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        license_id: data.license?.spdx_id,
        license: data.license?.name,
        language: data.language || "Other",
        tags: data.topics,
        year: Number(data.created_at.split("-")[0]),
      })
    );
  }
}

export default GithubClient;
