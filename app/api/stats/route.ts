import WakatimeClient, { DEFAULT_LANGUAGE_COLOR } from "@/lib/wakatime";

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

  const [languageColors, { data }] = await Promise.all([
    client.getLanguageColors(),
    client.getStats(),
  ]);

  const languagesRaw = data?.languages || [];
  const total_seconds = data.total_seconds;

  const languages: StatsResponse["languages"] = {};

  let otherSeconds = 0;
  for (const lang of languagesRaw) {
    const name = lang.name;
    const seconds = lang.total_seconds;
    const colour = languageColors[name.toLowerCase()] ?? DEFAULT_LANGUAGE_COLOR;
    const percentage = total_seconds ? (seconds / total_seconds) * 100 : 0;

    if (percentage >= 1) {
      languages[name] = {
        total_seconds: seconds,
        colour,
        percentage,
      };
    } else {
      otherSeconds += seconds;
    }
  }

  if (otherSeconds > 0) {
    languages["Other"] = {
      total_seconds: otherSeconds,
      colour: DEFAULT_LANGUAGE_COLOR,
      percentage: total_seconds ? (otherSeconds / total_seconds) * 100 : 0,
    };
  }

  let roundedSum = 0;

  for (const name in languages) {
    languages[name].percentage = Math.round(languages[name].percentage);
    roundedSum += languages[name].percentage;
  }

  if (Math.abs(roundedSum - 100) > 0) {
    const maxLang = Object.entries(languages).reduce((a, b) =>
      a[1].percentage > b[1].percentage ? a : b
    )[0];

    languages[maxLang].percentage -= roundedSum - 100;
  }

  return Response.json({ total_seconds, languages });
}
