import HomePage from "@/components/home/HomePage";

import { metadata as templateMetadata } from "./layout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  // @ts-ignore: never let the haters stop you from doing what you want
  title: templateMetadata.title?.template.replace("%s", "Home"),
};

export default async function Home() {
  return <HomePage />;
}
