import WakatimeClient from "@/lib/wakatime";
import { languageColourMapping } from "@/utils/constants";

export type StatsResponse = {
  total_seconds: number;
  languages: {
    [key: string]: {
      total_seconds: number;
      colour: string;
      percentage: number;
    };
  };
};

export async function GET() {
  const client = new WakatimeClient(process.env.WAKATIME_API_KEY!);
  const {
    data: { languages: rawLangs },
  } = await client.getStats();

  // I would rely on the "total_seconds" field here but for some reason,
  // it's inaccurate, so I just calculate it myself.
  const totalSec = rawLangs.reduce(
    (sum, { total_seconds }) => sum + total_seconds,
    0
  );

  const { buckets, otherSecs } = rawLangs.reduce<{
    buckets: Record<string, { secs: number; colour: string; rawPerc: number }>;
    otherSecs: number;
  }>(
    (acc, { name, total_seconds: secs }) => {
      const colour =
        languageColourMapping[
          name.toLowerCase() as keyof typeof languageColourMapping
        ];

      const rawPerc = (secs / totalSec) * 100;

      if (colour && rawPerc >= 1) {
        acc.buckets[name] = {
          secs,
          colour,
          rawPerc,
        };
      } else {
        acc.otherSecs += secs;
      }
      return acc;
    },
    { buckets: {}, otherSecs: 0 }
  );

  const result: StatsResponse["languages"] = {};

  let roundedSum = 0;

  for (const [name, { secs, colour, rawPerc }] of Object.entries(buckets)) {
    const pct = Math.round(rawPerc);
    result[name] = { total_seconds: secs, colour, percentage: pct };

    roundedSum += pct;
  }

  const otherRaw = (otherSecs / totalSec) * 100;
  let otherPct = Math.round(otherRaw);
  roundedSum += otherPct;

  const drift = 100 - roundedSum;

  if (otherSecs > 0) {
    otherPct += drift;
  } else if (drift !== 0) {
    const largest = Object.entries(buckets).reduce((a, b) =>
      a[1].rawPerc > b[1].rawPerc ? a : b
    )[0];

    result[largest].percentage += drift;
  }

  if (otherSecs > 0) {
    result.Other = {
      total_seconds: otherSecs,
      colour: languageColourMapping.default,
      percentage: otherPct,
    };
  }

  return Response.json({
    total_seconds: totalSec,
    languages: result,
  } satisfies StatsResponse);
}
