import type { APIRoute } from "astro";

import DiscordClient from "../../../lib/discord";
import type { ThirdPartySku, Website } from "../../../lib/discord/types";

export type ApplicationInfoResponse = {
  name: string;
  // aliases: string[];
  description: string;
  icon: string;
  themes: string[];
  // skus: {
  //   name: ThirdPartySku["distributor"];
  //   url: string;
  // }[];
  external_links: Website[];
  cover_image: string;
  screenshots: string[];
  studio: {
    name: string;
    publisher: boolean;
    developer: boolean;
  }[];
  // last_30_days_rank: number;
};

const mapSku = (sku: ThirdPartySku): Option<string> => {
  switch (sku.distributor) {
    case "steam":
      return `https://store.steampowered.com/app/${sku.id}/`;

    case "xbox":
    case "xbox_game_pass":
      return `https://www.xbox.com/games/store/p/${sku.id}`;

    default:
      return null;
  }
};

export const GET: APIRoute = async (request) => {
  const { request: req } = request;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "No ID provided." }, { status: 400 });
  }

  const { TOKEN } = import.meta.env;
  if (!TOKEN) {
    return Response.json(
      { error: "Invalid Server Configuration." },
      { status: 500 },
    );
  }

  const client = new DiscordClient(TOKEN);
  const data = await client.gameInfo([id]);

  request.cache.set({
    maxAge: 60 * 120,
    tags: ["api", "application-info"],
  });

  const application = data[0];

  if (!application) {
    return Response.json(null, { status: 404 });
  }

  const icon_hash =
    application.icon_hash || application.supplemental_game_data?.icon_hash;

  const cover_image =
    application.supplemental_game_data?.cover_image_url ||
    `https://cdn.discordapp.com/app-icons/${application.id}/${application.cover_image_hash}.png?size=1024&keep_aspect_ratio=true`;

  const resp: ApplicationInfoResponse = {
    name: application.name,
    // aliases: application.aliases,
    description: application.description,
    icon: `https://cdn.discordapp.com/app-icons/${application.id}/${icon_hash}.png?size=1024&keep_aspect_ratio=true`,
    themes: application.themes,
    // skus: application.third_party_skus
    //   .map((sku) => ({
    //     name: sku.distributor!,
    //     url: mapSku(sku)!,
    //   }))
    //   .filter((sku) => !!sku.url),
    external_links: application.websites,
    cover_image,
    screenshots: application.screenshot_urls,
    studio: application.companies.map(({ name, roles }) => ({
      name: name,
      publisher: roles.includes(1),
      developer: roles.includes(2),
    })),
    // last_30_days_rank: application.l30_rank,
  };

  return Response.json(resp);
};
