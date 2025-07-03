import React from "react";

import moment from "moment";

import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

import Socials from "./Socials";

import { DATE_OF_BIRTH } from "@/utils/constants";
import { getArticle } from "@/utils";

export default function HomePage() {
  const year_of_birth = moment().diff(DATE_OF_BIRTH, "years");

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <section>
        <h1 className="text-5xl!">
          Hello, I&apos;m{" "}
          <span className="text-pink-500 font-medium">Faaz</span>!
        </h1>

        <p>
          I am {getArticle(year_of_birth)} {year_of_birth} year old full-stack
          developer from the United Arab Emirates who loves programming both
          professionally and as a hobby.
        </p>

        <Socials />
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <LeftSide />
        </div>

        <div className="space-y-8 ">
          <RightSide />
        </div>
      </div>
    </div>
  );
}
