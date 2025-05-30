"use server";

import { languageColourMapping } from './constants'
import type { DiscordRPCActivity, ListRepositoryPayload, Project } from './types'

import { USER_AGENT } from ".";

export const fetchActivityDetails = async (activityId: string): Promise<Option<DiscordRPCActivity>> => {
  const req = await fetch(
    `https://discord.com/api/v10/applications/${activityId}/rpc`,
    {
      headers: {
        "User-Agent": USER_AGENT,
      },
    }
  )

  if (!req.ok) {
    return null;
  }

  const data = await req.json();
  return data as DiscordRPCActivity;
}


export const getProjects = async (limit: number = 3): Promise<Project[]> => {
  const req = await fetch(
    `https://api.github.com/users/du-cki/repos?type=owner&sort=updated&per_page=${limit}`,
    {
      headers: {
        "User-Agent": USER_AGENT,
        accept: 'application/vnd.github+json'
      }
    }
  )

  if (!req.ok) {
    throw new Error(`${req.status}: ${req.statusText}`)
  }

  const resp = await req.json()

  return resp.map((data: ListRepositoryPayload) => ({
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
    language: data.language || 'Other',
    color:
      languageColourMapping[
      data
        .language?.toLowerCase()
        .replace(' ', '_') as keyof typeof languageColourMapping
      ] || '#ADADAD',
    tags: data.topics
  }))
}