import React from "react";

import { ExternalLink } from "lucide-react";

type Props = {
  name: string;
  year: number;
  href: string;
  description: string;
  tags: string[];
};

export default function Project({
  name,
  year,
  href,
  description,
  tags,
}: Props) {
  return (
    <div className="border-l-2 border-gray-200 pl-6 pb-3">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">{year}</span>

          <a
            href={href}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <p className="text-gray-600 font-medium!">{description}</p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
