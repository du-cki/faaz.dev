import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Construction from './pages/Construction';
import NotFound from './pages/404';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Construction />} />
      <Route path="/projects" element={<Construction />} />
      <Route path="/project/:project" element={<Construction />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
