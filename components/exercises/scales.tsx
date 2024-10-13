"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MusicIcon, PianoIcon, ArrowRightIcon } from 'lucide-react';

type ScaleType = 'notes' | 'chords' | 'arpeggios';

export function ScalesExercise() {
  const [scaleType, setScaleType] = useState<ScaleType>('notes');
  const [scale, setScale] = useState('C Major');

  const renderExercise = () => {
    switch (scaleType) {
      case 'notes':
        return <p>Practice playing the notes of the {scale} scale.</p>;
      case 'chords':
        return <p>Practice playing the chords in the {scale} scale.</p>;
      case 'arpeggios':
        return <p>Practice playing arpeggios in the {scale} scale.</p>;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Scales Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scaleType">Scale Exercise Type</Label>
          <Select value={scaleType} onValueChange={(value) => setScaleType(value as ScaleType)}>
            <SelectTrigger id="scaleType">
              <SelectValue placeholder="Select scale exercise type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="chords">Chords</SelectItem>
              <SelectItem value="arpeggios">Arpeggios</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scale">Scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="scale">
              <SelectValue placeholder="Select scale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C Major">C Major</SelectItem>
              <SelectItem value="G Major">G Major</SelectItem>
              <SelectItem value="D Major">D Major</SelectItem>
              <SelectItem value="A Minor">A Minor</SelectItem>
              <SelectItem value="E Minor">E Minor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-secondary p-4 rounded">
          {renderExercise()}
        </div>
        <Button className="w-full">
          <PianoIcon className="mr-2 h-4 w-4" />
          Start Practice
        </Button>
      </CardContent>
    </Card>
  );
}