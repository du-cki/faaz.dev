export type Website = {
  url: string;
  // categories are as follows:
  // 1: official website
  // 2: wikia/fandom
  // 3: wikipedia
  // 4: facebook
  // 5: twitter
  // 6: twitch
  // 7: ??
  // 8: instagram
  // 9: youtube
  // 10: app store (iphone)
  // 11: app store (ipad)
  // 12: google play (android)
  // 13: steam
  // 14: reddit
  // 15: ??
  // 16: ??
  // 17: gog
  // 18: discord
  category: number;
};

type Executable = {
  os: "win32" | "darwin" | "linux" | string;
  name: string;
  is_launcher: boolean;
};

export type ThirdPartySku = {
  distributor:
    | "steam"
    | "gop"
    | "igdb"
    | "epic"
    | "xbox"
    | "xbox_game_pass"
    | "microsoft"
    | "playstation"
    | "gdco";
  id: string;
};

export type ApplicationInfo = {
  id: string;
  name: string;
  icon: string;
  description: string;
  summary: string;
  type: number;
  is_monetized: boolean;
  is_verified: boolean;
  is_discoverable: boolean;
  cover_image: string;
  splash: string;
  third_party_skus: ThirdPartySku[];
  bot?: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string;
    avatar_decoration_data: string | null;
    collectibles: string | null;
    discriminator: string | null;
    display_name_styles: string | null;
    public_flags: number;
    primary_guild: string | null;
    clan: null;
    bot: true;
    banner: string | null;
    banner_color: string | null;
    accent_color: string | null;
  };
  linked_games?: ApplicationInfo[];
  hook: boolean;
  aliases: string[];
  executables: Executable[];
  storefront_available: boolean;
  bot_public: boolean;
  bot_require_code_grant: boolean;
  integration_types_config: Record<string, unknown>;
  verify_key: string;
  flags: number;
};

export type GameInfo = {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  icon_hash: string;
  executables: Executable[];
  third_party_skus: ThirdPartySku[];
  overlay: boolean;
  overlay_warn: boolean;
  overlay_compatibility_hook: boolean;
  overlay_methods: any | null;
  hook: boolean;
  themes: string[];
  linked_applications: {
    id: string;
    type: number;
  }[];
  media: {
    cover_url: string;
    artwork_urls: string[];
    icon: {
      type: string;
      value: string;
    };
    cover: {
      type: "url";
      value: string;
    };
  };
  supplemental_game_data?: {
    application_id: string;
    igdb_game_id: string | null;
    name: string;
    summary: string;
    summary_localized: string | null;
    icon_hash: string;
    cover_image_url: string;
    artwork_urls: string[];
    screenshot_urls: string[];
    themes: number[];
    platforms: number[];
    genres: number[];
    first_release_date: string; // ISO 8601
    websites: Website[];
    publisher_names: string[];
    developer_names: string[];
    steam_id: string;
    l30_rank: number;
  };
  genres: number[];
  platforms: number[];
  cover_image_hash: string;
  banner_hash: string;
  screenshot_urls: string[];
  websites: Website[];
  companies: {
    name: string;
    roles: number[]; // 1 = publisher, 2 = developer
  }[];
  l30_rank: number;
};
