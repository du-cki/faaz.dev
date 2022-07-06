import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const activeClassName = 'text-gray-600 dark:text-white underline underline-offset-8';

  return (
    <nav className="flex w-full justify-evenly items-center absolute">
      <NavLink to="/" className="font-bold">ducki</NavLink>
      <ul className="flex p-2">
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? activeClassName : undefined)}
          >
            Projects
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
