import React from "react";

import Page from "../common/Page";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MusicPage() {
  return (
    <Page>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />

        <span>Back to portfolio</span>
      </Link>

      <section>
        <h1 className="text-5xl!">
          My <span className="text-pink-500 font-medium">Music Taste</span>
        </h1>

        <p>My latest music activity on Last FM.</p>
      </section>
    </Page>
  );
}
