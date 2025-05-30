import { fetchActivityDetails } from "./actions"
import { ACTIVITY_COVER_EXPIRY, ACTIVITY_COVER_KEY } from "./constants"

export const USER_AGENT = "faaz.dev (github.com/du-cki/faaz.dev)"

export const si = (raw_url: string): string => {
  const [_, id] = raw_url.split(":")

  return `https://i.scdn.co/image/${id}`
}

export const st = (trackId: string): string => {
  return `https://open.spotify.com/track/${trackId}`
}

export const sa = (artistName: string): string => {
  return `https://open.spotify.com/search/${encodeURIComponent(
    artistName
  )}/artists`
}

export const la = (track_url: string): string => {
  const match = track_url.match(/^(https:\/\/www\.last\.fm\/music\/[^\/]+)/);
  return match?.[1]!;
}

export const getArticle = (num: number): string => {
  const spoken = num.toString();

  const vowelSounds = ['8', '11', '18'];
  const startsWithVowelSound = vowelSounds.some(v => spoken.startsWith(v));

  return startsWithVowelSound ? 'an' : 'a';
}

type ActivityCover = {
  activityId: string;
  iconHash: string;
  expiry: number;
}

export const getActivityCover = async (activityId: string): Promise<Option<string>> => {
  const covers = JSON.parse(localStorage.getItem(ACTIVITY_COVER_KEY) || "[]") as ActivityCover[];

  const cover = covers.filter(
    (cover: ActivityCover) => cover.expiry > Date.now()
  ).find(
    (cover: ActivityCover) => cover.activityId === activityId
  );

  if (cover) {
    return `https://cdn.discordapp.com/app-icons/${activityId}/${cover.iconHash}.webp`;
  }

  const activity = await fetchActivityDetails(activityId)
  if (!activity || !activity.icon) {
    return null;
  }

  const expiry = Date.now() + ACTIVITY_COVER_EXPIRY;
  covers.push({ activityId, iconHash: activity.icon, expiry } satisfies ActivityCover);
  localStorage.setItem(ACTIVITY_COVER_KEY, JSON.stringify(covers));

  return `https://cdn.discordapp.com/app-icons/${activityId}/${activity.icon}.webp`;
}