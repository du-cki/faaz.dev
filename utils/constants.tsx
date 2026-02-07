import GithubClient from "@/lib/github";
import LanyardClient from "@/lib/lanyard";

import type { DiscordStatus } from "@/lib/lanyard/types";

import { Github, Mail, MessageCircle, Music } from "lucide-react";

export const SOCIALS: { name: string; href: string; icon: React.ReactNode }[] =
  [
    {
      name: "Discord",
      href: "https://discord.com/users/651454696208465941",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      name: "GitHub",
      href: "https://github.com/du-cki",
      icon: <Github className="w-6 h-6" />,
    },
    {
      name: "Spotify",
      href: "https://open.spotify.com/user/mjbcspgcrzp4188egf1zo6c9s",
      icon: <Music className="w-6 h-6" />,
    },
    {
      name: "Email",
      href: "mailto:me@faaz.dev",
      icon: <Mail className="w-6 h-6" />,
    },
  ];

export const languageColourMapping = {
  rust: "#DEA584",
  python: "#FFD43B",
  html: "#E34C26",
  javascript: "#F0DB4F",
  typescript: "#3178C6",
  vue: "#41B883",
  css: "#563d7C",
  ruby: "#701516",
  c: "#555555",
  emacs_lisp: "#C065DB",
  "c#": "#178600",
  "c++": "#F34B7D",
  shell: "#89E051",
  jinja: "#A52A22",
  go: "#00ADD8",
  makefile: "#427819",
  default: "#555555",
  "git config": "#F44D27",
  json: "#292929",
  docker: "#0db7ed",
  bash: "#89e051",
  sql: "#e38c00",
  lua: "#000080",
  yaml: "#CB171E",
  markdown: "#083fa1",
};

export const STATUS_COLORS: Record<DiscordStatus, string> = {
  online: "#41b682",
  idle: "#f5a623",
  dnd: "#ef4444",
  offline: "#8f919e",
};

export const DATE_OF_BIRTH = process.env.NEXT_PUBLIC_DATE_OF_BIRTH!;
export const DISCORD_USER_ID = process.env.NEXT_PUBLIC_DISCORD_USER_ID!;

export const FRIENDS = [
  {
    name: "Willi",
    githubUsername: "itswilliboy",
    githubId: 83978878,
    href: "https://itswilli.dev/",
  },
  {
    name: "Dep",
    githubUsername: "depreca1ed",
    githubId: 70801324,
    href: "https://deprecating.xyz/",
  },
];

export const USER_AGENT = "faaz.dev (github.com/du-cki/faaz.dev)";

export const lanyard = new LanyardClient();
export const github = new GithubClient();
