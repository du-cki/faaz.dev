import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/404';
import Projects from './pages/Projects';
import Project from './pages/Project';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/project/:project" element={<Project />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
