import LeftSide from "./LeftSide";

import { SOCIALS } from "@/utils/constants";
import RightSide from "./RightSide";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <section>
        <h1 className="text-5xl!">
          Hello, I&apos;m{" "}
          <span className="text-pink-500 font-medium">Faaz</span>!
        </h1>

        <p>
          I am an 18 year old full-stack developer from the United Arab Emirates
          who loves programming both professionally and as a hobby.
        </p>

        <div className="flex gap-4 mb-8">
          {SOCIALS.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
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
