"use client";

import React from "react";

import { Tooltip } from "react-tooltip";

import { SOCIALS } from "@/utils/constants";

export default function Socials() {
  return (
    <div className="flex gap-4 mb-8">
      <Tooltip id="connection-tooltip" style={{ padding: 5 }} />

      {SOCIALS.map(({ name, href, icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
          data-tooltip-content={name}
          data-tooltip-place="top"
          data-tooltip-id="connection-tooltip"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
