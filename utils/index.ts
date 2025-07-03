import moment from "moment-timezone";

import type { DiscordActivity } from "@/lib/lanyard/types";

export const getArticle = (num: number): string => {
  const spoken = num.toString();

  const vowelSounds = ["8", "11", "18"];
  const startsWithVowelSound = vowelSounds.some((v) => spoken.startsWith(v));

  return startsWithVowelSound ? "an" : "a";
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

const parseUtcOffset = (offset: number): string => {
  return `${offset > 0 ? "GMT+" : "GMT-"}${Math.abs(offset / 60)}`;
};

export const getTimeForTimezone = (tz: string): string => {
  const time = moment().tz(tz);
  const offset = parseUtcOffset(time.utcOffset());

  return `${time.format("hh:mm A")} (${offset})`;
};
