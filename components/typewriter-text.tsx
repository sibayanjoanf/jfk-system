'use client';

import Typewriter from 'typewriter-effect';

export function TypewriterText() {
  return (
    <Typewriter
      options={{
        strings: ['homes', 'dreams', 'comfort'],
        autoStart: true,
        loop: true,
        deleteSpeed: 150,
        delay: 150,
        cursor: '',
      }}
    />
  );
}