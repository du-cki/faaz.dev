import GithubClient from "../lib/github";

import { SiDiscord, SiGithub, SiSpotify } from "@icons-pack/react-simple-icons";
import { Mail, type LucideIcon } from "lucide-react";
import APIClient from "../lib/api";

export const USER_AGENT = "faaz.dev (github.com/du-cki/faaz.dev)";

export const GITHUB_USERNAME = "du-cki";
export const LASTFM_USERNAME = "du_cki";

export const DATE_OF_BIRTH = "2006-12-01T20:00:00.000Z";
export const DISCORD_USER_ID = "651454696208465941";

export const api = new APIClient();
export const github = new GithubClient();

export enum StatusColor {
  online = "#41b682",
  idle = "#f5a623",
  dnd = "#ef4444",
  offline = "#8f919e",
}

export const Socials: { name: string; href: string; icon: LucideIcon }[] = [
  {
    name: "@du_cki",
    href: `https://discord.com/users/${DISCORD_USER_ID}`,
    icon: SiDiscord,
  },
  {
    name: "@du-cki",
    href: "https://github.com/du-cki",
    icon: SiGithub,
  },
  {
    name: "@faaz",
    href: "https://open.spotify.com/user/mjbcspgcrzp4188egf1zo6c9s",
    icon: SiSpotify,
  },
  {
    name: "me@faaz.dev",
    href: "mailto:me@faaz.dev",
    icon: Mail,
  },
];

export const Friends = [
  {
    name: "Willi",
    githubUsername: "itswilliboy",
    href: "https://itswilli.dev/",
  },
  {
    name: "Dep",
    githubUsername: "Deprecatism",
    href: "https://deppie-dev.vercel.app/",
  },
  {
    name: "Vahin",
    githubUsername: "ShadowFox88",
    href: "https://vahin.dev/",
  },
];
