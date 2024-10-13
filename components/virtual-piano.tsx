"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const keys = [
  { note: 'C', color: 'white' },
  { note: 'C#', color: 'black' },
  { note: 'D', color: 'white' },
  { note: 'D#', color: 'black' },
  { note: 'E', color: 'white' },
  { note: 'F', color: 'white' },
  { note: 'F#', color: 'black' },
  { note: 'G', color: 'white' },
  { note: 'G#', color: 'black' },
  { note: 'A', color: 'white' },
  { note: 'A#', color: 'black' },
  { note: 'B', color: 'white' },
];

export function VirtualPiano() {
  const [lastPlayedNote, setLastPlayedNote] = useState('');

  const playNote = (note: string) => {
    // In a real app, we would play the actual note sound here
    setLastPlayedNote(note);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        {keys.map(({ note, color }) => (
          <Button
            key={note}
            className={`w-12 h-40 ${
              color === 'white' ? 'bg-white text-black' : 'bg-black text-white'
            } border border-gray-300 ${
              color === 'black' ? 'relative -mx-6 z-10 h-28' : ''
            }`}
            onClick={() => playNote(note)}
          >
            {note}
          </Button>
        ))}
      </div>
      <p className="text-center mt-4">Last played note: {lastPlayedNote}</p>
    </div>
  );
}