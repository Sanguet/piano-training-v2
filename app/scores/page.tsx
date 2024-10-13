"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileIcon, UploadIcon } from 'lucide-react';

type Score = {
  id: string;
  name: string;
  type: 'default' | 'user';
  fileType: 'musicxml' | 'midi';
};

const defaultScores: Score[] = [
  { id: '1', name: 'Fur Elise', type: 'default', fileType: 'musicxml' },
  { id: '2', name: 'Moonlight Sonata', type: 'default', fileType: 'midi' },
];

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>(defaultScores);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.name.endsWith('.musicxml') ? 'musicxml' : 'midi';
      const newScore: Score = {
        id: Date.now().toString(),
        name: file.name,
        type: 'user',
        fileType,
      };
      setScores([...scores, newScore]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Scores</h1>
      <div className="mb-8">
        <Input
          type="file"
          accept=".musicxml,.midi,.mid"
          onChange={handleFileUpload}
          className="hidden"
          id="score-upload"
        />
        <label htmlFor="score-upload">
          <Button as="span" className="cursor-pointer">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Score
          </Button>
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scores.map((score) => (
          <Card key={score.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileIcon className="mr-2 h-4 w-4" />
                {score.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {score.type}</p>
              <p>File Format: {score.fileType}</p>
              <Button className="mt-4">View Score</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}