import { languageColourMapping } from './constants'

import type { ListRepositoryPayload, Project } from './types'

const config = useRuntimeConfig()

const getRecentProjects = async (): Promise<Project[]> => {
  const req = await fetch(
    'https://api.github.com/users/du-cki/repos?type=owner&sort=updated&per_page=3',
    {
      headers: {
        accept: 'application/vnd.github+json'
      }
    }
  )

  if (!req.ok) {
    throw new Error(`Could not react GitHub, request returned a ${req.status}`)
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
    license_id: data.license?.spdx_id,
    license: data.license?.name,
    language: data.language || 'Other',
    color:
      languageColourMapping[
        data
          .language!.toLowerCase()
          .replace(' ', '_') as keyof typeof languageColourMapping
      ] || config.public.PROJECT_DEFAULT_COLOR,
    tags: data.topics
  }))
}

const st = (trackId: string) => {
  return `https://open.spotify.com/track/${trackId}`
}

const sa = (artistName: string) => {
  return `https://open.spotify.com/search/${encodeURIComponent(
    artistName
  )}/artists`
}

export { getRecentProjects, st, sa }
