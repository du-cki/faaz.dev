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
  const now = Date.now();
  let covers: ActivityCover[] = [];

  try {
    covers = JSON.parse(localStorage.getItem(ACTIVITY_COVER_KEY) || "[]");
  } catch {
    covers = [];
  }

  covers = covers.filter(cover => cover.expiry > now);
  const cover = covers.find(cover => cover.activityId === activityId);

  if (cover) {
    if (cover.iconHash.endsWith(".png")) {
      return cover.iconHash;
    }

    return `https://cdn.discordapp.com/app-icons/${activityId}/${cover.iconHash}.webp`;
  }

  const activity = await fetchActivityDetails(activityId);
  if (!activity || (activity.name !== "Xbox" && !activity.icon)) {
    return null;
  }

  let iconHash = activity.icon;
  if (activity.name === "Xbox") {
    iconHash = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/480px-Xbox_one_logo.svg.png";
  }

  const expiry = now + ACTIVITY_COVER_EXPIRY;
  covers.push({ activityId, iconHash, expiry });
  localStorage.setItem(ACTIVITY_COVER_KEY, JSON.stringify(covers));

  if (iconHash.endsWith(".png")) {
    return iconHash;
  }

  return `https://cdn.discordapp.com/app-icons/${activityId}/${activity.icon}.webp`;
};