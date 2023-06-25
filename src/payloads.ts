interface Owner {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    // theres a bunch of URLs I ignored, because I had no use for them.
    type: string,
    site_admin: boolean
};

interface License {
    key: string,
    name: string,
    spdx_id: string,
    url: string,
    node_id: string
};

interface ListRepositoryPayload {
    id: number,
    node_id: string,
    name: string,
    full_name: string,
    private: boolean,
    owner: Owner
    html_url: string,
    description: string,
    fork: boolean,
    // ignored a bunch of urls again.
    created_at: string,
    updated_at: string,
    pushed_at: string,
    homepage: string,
    size: number,
    stargazers_count: number
    watchers_count: number
    language?: string,
    has_issues: boolean,
    topics: string[],
    has_projects: boolean,
    has_downloads: boolean,
    has_wiki: boolean,
    has_pages: boolean,
    has_discussions: boolean,
    forks_count: number,
    archived: boolean,
    disabled: boolean,
    open_issues_count: 0,
    license: License,
    allow_forking: boolean,
    is_template: boolean,
    web_commit_signoff_required: boolean,
};

interface Project {
    homepage: string,
    repo_url: string,
    repo_name: string,
    owner: string,
    owner_url: string,
    description: string,
    stars: number,
    license_id: string,
    license: string,
    language: string,
    color: string,
    tags: string[]
}

interface Song {
    title: string,
    artists: string[],
    track_image: string,
    track_url: string,
    album: string,
    sync_id: string
}

export type {
    ListRepositoryPayload,
    Project,
    Song
};
