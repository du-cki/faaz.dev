import type { DiscordActivity } from "@/lib/lanyard/types";

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
