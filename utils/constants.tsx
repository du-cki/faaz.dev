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

export const STATUS_COLORS: Record<DiscordStatus, string> = {
  online: "#41b682",
  idle: "#f5a623",
  dnd: "#ef4444",
  offline: "#8f919e",
};

export const DATE_OF_BIRTH = process.env.NEXT_PUBLIC_DATE_OF_BIRTH!;
export const DISCORD_USER_ID = process.env.NEXT_PUBLIC_DISCORD_USER_ID!;

export const lanyard = new LanyardClient();
