import React from "react";

import NextLink from "next/link";

type Props = {
  icon: React.ReactNode;
  text: string;
  href: string;
  description: string;
};

export default function Link({ icon, text, href, description }: Props) {
  return (
    <NextLink
      href={href}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group shadow-md"
    >
      {icon}

      <div>
        <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
          {text}
        </span>

        <span className="text-xs text-gray-600">{description}</span>
      </div>
    </NextLink>
  );
}
