import React from "react";

import Python from "@/icons/python.svg";
import JavaScript from "@/icons/javascript.svg";
import Rust from "@/icons/rust.svg";
import Vue from "@/icons/vue.svg";
import ReactLogo from "@/icons/react.svg";
import Tailwind from "@/icons/tailwindcss.svg";
import PostgreSQL from "@/icons/postgresql.svg";
import Redis from "@/icons/redis.svg";
import Docker from "@/icons/docker.svg";

import Project from "@/components/common/Project";
import Section from "@/components/common/Section";

import { getProjects } from "@/utils/actions";
import Segment from "./Segment";

export default async function About() {
  const projects = await getProjects();

  return (
    <Section>
      <Segment
        title="Expertise"
        description={
          <>
            Proficient in{" "}
            <a href="https://www.python.org" target="_blank">
              Python
            </a>{" "}
            and{" "}
            <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank">
              JavaScript
            </a>
            , with expertise in data analysis, machine learning and web
            development. I'm currently learning{" "}
            <a href="https://www.rust-lang.org" target="_blank">
              Rust
            </a>{" "}
            for its speed, memory safety, and concurrency features for systems
            programming.
          </>
        }
      >
        <div className="mt-2 space-x-3 *:inline-block">
          <Python />
          <JavaScript />
          <Rust className="fill-black dark:fill-white" />
          <Vue />
          <ReactLogo />
          <Tailwind />
          <PostgreSQL />
          <Redis />
          <Docker />
        </div>
      </Segment>

      <div className="my-10" />

      <Segment
        title="Projects"
        align="right"
        description={
          <>
            I maintain a bunch of projects over at my{" "}
            <a href="https://github.com/du-cki">GitHub</a>. Here are some of my
            recent contributions
          </>
        }
      >
        <div className="flex flex-col lg:flex-row justify-between mt-5 space-y-5 lg:space-y-0 lg:space-x-5">
          {projects.map((project) => (
            <Project
              key={`${project.owner}/${project.repo_name}`}
              details={project}
            />
          ))}
        </div>
      </Segment>
    </Section>
  );
}
