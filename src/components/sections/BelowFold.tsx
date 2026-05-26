'use client';

import dynamic from 'next/dynamic';

const Experience = dynamic(() => import('./Experience'));
const Skills = dynamic(() => import('./Skills'));
const Contact = dynamic(() => import('./Contact'));

export default function BelowFold() {
  return (
    <>
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
