"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ProgressPage() {
  // In a real app, this data would come from a database or API
  const progressData = {
    NoteRecognition: 75,
    RhythmAccuracy: 60,
    SightReading: 40,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Progress</h1>
      <div className="grid gap-6 max-w-xl mx-auto">
        {Object.entries(progressData).map(([skill, value]) => (
          <Card key={skill}>
            <CardHeader>
              <CardTitle>{skill.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={value} className="w-full" />
              <p className="text-right mt-2">{value}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}