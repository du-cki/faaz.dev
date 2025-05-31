import React from "react";

import Section from "@/components/common/Section";
import Segment from "./Segment";

import Item from "@/components/common/Item";

import { BASE_URL } from "@/utils/constants";

import type { SongsResponse } from "@/utils/types";

async function getMusicData(): Promise<SongsResponse> {
  const req = await fetch(`${BASE_URL}/api/music?minified=true`);

  if (!req.ok) {
    const errorMessage = await req.text();

    throw new Error(`${req.status}: ${errorMessage}`);
  }

  return req.json();
}

export default async function Music() {
  const data = await getMusicData();

  return (
    <Section align="normal">
      <Segment
        title="Music"
        description={`I'm a big fan of music! I enjoy listening to a wide range of 
              genres and songs. Here are the tracks I've been listening to lately.`}
      >
        <div className="flex flex-row flex-wrap mt-5">
          {data.recentTracks.map((music, index) => (
            <React.Fragment key={`${music.url}_${index}`}>
              <Item music={music} />
            </React.Fragment>
          ))}
        </div>
      </Segment>
    </Section>
  );
}
