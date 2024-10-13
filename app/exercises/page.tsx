"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteRecognitionExercise } from '@/components/exercises/note-recognition';
import { SightReadingExercise } from '@/components/exercises/sight-reading';
import { ScalesExercise } from '@/components/exercises/scales';
import { MusicIcon, WavesIcon, EyeIcon, PianoIcon } from 'lucide-react';

type ExerciseType = 'noteRecognition' | 'rhythmAccuracy' | 'sightReading' | 'scales' | null;

export default function ExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(null);

  const exerciseTypes = [
    { type: 'noteRecognition', title: 'Note Recognition', icon: MusicIcon },
    { type: 'rhythmAccuracy', title: 'Rhythm Accuracy', icon: WavesIcon },
    { type: 'sightReading', title: 'Sight Reading', icon: EyeIcon },
    { type: 'scales', title: 'Scales', icon: PianoIcon },
  ];

  const renderExercise = () => {
    switch (selectedExercise) {
      case 'noteRecognition':
        return <NoteRecognitionExercise />;
      case 'sightReading':
        return <SightReadingExercise />;
      case 'scales':
        return <ScalesExercise />;
      case 'rhythmAccuracy':
        return (
          <div className="text-center p-4">
            <p>Rhythm Accuracy exercise is not implemented yet.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Piano Exercises</h1>
      {!selectedExercise ? (
        <div className="max-w-md mx-auto space-y-6">
          {exerciseTypes.map(({ type, title, icon: Icon }) => (
            <Card 
              key={type} 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => setSelectedExercise(type as ExerciseType)}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="mr-2 h-6 w-6" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Click to start the exercise</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <Button onClick={() => setSelectedExercise(null)} className="mb-4">
            Back to Exercises
          </Button>
          {renderExercise()}
        </div>
      )}
    </div>
  );
}