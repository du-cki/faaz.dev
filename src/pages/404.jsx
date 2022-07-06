import React from 'react';
import Container from '../components/container';

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center">
        <h1 className="text-6xl">404</h1>
        <h1 className="text-2xl">
          This
          <span className="font-bold"> Page </span>
          was
          <span className="font-bold"> Not Found</span>
          .
        </h1>
      </div>
    </Container>
  );
}
