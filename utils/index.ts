import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

import type { DiscordActivity } from "../lib/api/types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const getArticle = (num: number): string => {
  const vowelSounds = [8, 11, 18];
  return vowelSounds.includes(num) ? "an" : "a";
};

export const calculatePercentage = ({
  start,
  end,
}: DiscordActivity["timestamps"]) => {
  let startTime = Date.now() - start;
  const endTime = end! - start;

  if (startTime >= endTime) {
    startTime = endTime;
  }

  return (startTime / endTime) * 100;
};

export const st = (trackId: string): string => {
  return `https://open.spotify.com/track/${trackId}`;
};

export const si = (raw_url: string): string => {
  const [_, id] = raw_url.split(":");
  return `https://i.scdn.co/image/${id}`;
};

export const ai = (activity_id: number, image_id: string): string => {
  if (image_id.startsWith("mp:external")) {
    const chunks = image_id.split("/").slice(3);

    return `https://${chunks.join("/")}`;
  }

  return `https://cdn.discordapp.com/app-assets/${activity_id}/${image_id}.png`;
};

const parseUtcOffset = (offset: number): string => {
  return `${offset > 0 ? "GMT+" : "GMT-"}${Math.abs(offset / 60)}`;
};

export const getRelativeTime = (ts: number): string => {
  return dayjs.unix(ts).fromNow();
};

export const getTimeForTimezone = (tz: string): string => {
  const time = dayjs().tz(tz);
  const offset = parseUtcOffset(time.utcOffset());

  return `${time.format("hh:mm A")} (${offset})`;
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const resolveUrl = (base: string, protocol: string): string =>
  base.includes("localhost")
    ? `${protocol}://${base}`
    : `${protocol}s://${base}`;
