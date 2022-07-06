import React from 'react';
import NavBar from './NavBar';

export default function Container({ children }) {
  return (
    <div className="flex items-center flex-col w-screen h-screen select-none">
      <NavBar />
      <div className="flex justify-center items-center h-full">
        { children }
      </div>
    </div>
  );
}
