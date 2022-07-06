// this is a placeholder for now, I'll add more stuff here later

import React from 'react';
import { useParams } from 'react-router-dom';

import Container from '../components/container';
import NotFound from './404';

export default function Project() {
  const { project } = useParams();
  const projects = ['test_project', 'another_project'];

  if (!projects.includes(project)) {
    return <NotFound />;
  }

  return (
    <Container>
      <div>
        { project }
      </div>
    </Container>
  );
}
