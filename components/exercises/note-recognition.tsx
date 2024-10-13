"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export function NoteRecognitionExercise() {
  const [currentNote, setCurrentNote] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRandomNote();
  }, []);

  const generateRandomNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(randomNote);
  };

  const handleGuess = (guess: string) => {
    if (guess === currentNote) {
      setScore(score + 1);
    }
    generateRandomNote();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Guess the Note</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4 text-center">{currentNote}</p>
        <div className="grid grid-cols-3 gap-2">
          {notes.map((note) => (
            <Button key={note} onClick={() => handleGuess(note)}>
              {note}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-center">Score: {score}</p>
      </CardContent>
    </Card>
  );
}