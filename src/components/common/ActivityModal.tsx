import React, { type ReactNode } from "react";
import type { ApplicationInfoResponse } from "../../pages/api/application-info";
import { Globe } from "lucide-react";
import {
  SiAppstore,
  SiDiscord,
  SiFacebook,
  SiGogdotcom,
  SiGoogleplay,
  SiInstagram,
  SiReddit,
  SiSteam,
  SiTwitch,
  SiWikipedia,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";

const ICON_MAPPING = {
  1: <Globe />,
  3: <SiWikipedia />,
  4: <SiFacebook />,
  5: <SiX />,
  6: <SiTwitch />,
  8: <SiInstagram />,
  9: <SiYoutube />,
  10: <SiAppstore />,
  11: <SiAppstore />,
  12: <SiGoogleplay />,
  13: <SiSteam />,
  14: <SiReddit />,
  17: <SiGogdotcom />,
  18: <SiDiscord />,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h1 className="text-xs! text-gray-500 tracking-widest select-none">
        {title}
      </h1>

      {children}
    </section>
  );
}

export const ActivityModal: React.FC<{ data: ApplicationInfoResponse }> = ({
  data,
}) => {
  const developers = data.studio
    .filter((s) => s.developer)
    .map((s) => s.name)
    .join(", ");

  const publishers = data.studio
    .filter((s) => s.publisher)
    .map((s) => s.name)
    .join(", ");

  const bannerImage =
    data.screenshots?.length > 0 ? data.screenshots[1] : data.cover_image;

  return (
    <div className="flex flex-col w-full bg-card-background text-gray-800">
      <div className="relative">
        <div className="relative w-full h-60 rounded-t-xl overflow-hidden">
          <img
            src={bannerImage}
            alt={`${data.name} banner`}
            className="w-full h-full object-cover object-top"
          />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-white/0 to-card-background pointer-events-none" />
        </div>

        <img
          src={data.cover_image}
          alt={`${data.name} cover`}
          className="absolute left-6 bottom-0 z-10 w-36 h-52 rounded-xl shadow-lg object-cover"
        />
      </div>

      <div className="px-6 pt-4 pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 leading-tight mb-0!">
          {data.name}
        </h1>

        {data.themes.length > 0 && (
          <span className="text-md text-gray-400">
            {data.themes.join(", ")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 px-6 pb-8 space-y-8">
          <Section title="About">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </Section>

          {data.screenshots?.length > 0 && (
            <Section title="Gallery">
              <div className="-mr-6 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x pr-6">
                  {data.screenshots.slice(1).map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Screenshot ${idx + 2}`}
                      className="h-28 sm:h-36 w-auto object-cover rounded-lg snap-center shrink-0 border border-gray-100"
                    />
                  ))}
                </div>
              </div>
            </Section>
          )}
        </div>

        <div className="px-6 md:px-5 pb-8 md:border-l border-gray-100 space-y-6">
          {developers && (
            <Section title="Developer">
              <p className="text-gray-800 font-medium">{developers}</p>
            </Section>
          )}

          {publishers && publishers !== developers && (
            <Section title="Publisher">
              <p className="text-gray-800 font-medium">{publishers}</p>
            </Section>
          )}

          {data.external_links.length > 0 && (
            <Section title="External Links">
              <div className="flex flex-wrap gap-4">
                {data.external_links
                  .filter((website) => website.category in ICON_MAPPING)
                  .map((website) => {
                    const iconKey =
                      website.category as keyof typeof ICON_MAPPING;

                    return (
                      <a
                        key={website.url}
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                      >
                        {ICON_MAPPING[iconKey]}
                      </a>
                    );
                  })}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};
