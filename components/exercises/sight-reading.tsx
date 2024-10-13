"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MusicIcon } from 'lucide-react';

type ScoreOptions = {
  level: string;
  chords: string;
  handsPlay: string;
};

export function SightReadingExercise() {
  const [options, setOptions] = useState<ScoreOptions>({
    level: 'beginner',
    chords: 'none',
    handsPlay: 'separate',
  });

  const [generatedScore, setGeneratedScore] = useState<string | null>(null);

  const handleOptionChange = (option: keyof ScoreOptions, value: string) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  const generateScore = () => {
    setGeneratedScore(`Generated score with options:
    Level: ${options.level}
    Chords: ${options.chords}
    Hands play: ${options.handsPlay}`);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sight Reading Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={options.level}
            onValueChange={(value) => handleOptionChange('level', value)}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="chords">Chords</Label>
          <Select
            value={options.chords}
            onValueChange={(value) => handleOptionChange('chords', value)}
          >
            <SelectTrigger id="chords">
              <SelectValue placeholder="Select chord option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="2-note">2-note chords</SelectItem>
              <SelectItem value="2-3-note">2 or 3-note chords</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="handsPlay">Hands Play</Label>
          <Select
            value={options.handsPlay}
            onValueChange={(value) => handleOptionChange('handsPlay', value)}
          >
            <SelectTrigger id="handsPlay">
              <SelectValue placeholder="Select hands play option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="separate">Separate/5-finger position</SelectItem>
              <SelectItem value="together-5finger">Together/5-finger position</SelectItem>
              <SelectItem value="together-outside">Together/Outside of 5-finger position</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generateScore} className="w-full">
          <MusicIcon className="mr-2 h-4 w-4" />
          Generate Score
        </Button>
        {generatedScore && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Generated Score</h3>
            <pre className="whitespace-pre-wrap bg-secondary p-4 rounded">{generatedScore}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}