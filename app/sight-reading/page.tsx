import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function SightReadingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sight Reading Practice</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Difficulty Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="note-range"
                className="block text-sm font-medium mb-2"
              >
                Note Range
              </label>
              <Slider
                id="note-range"
                defaultValue={[1, 7]}
                max={7}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="rhythm-complexity"
                className="block text-sm font-medium mb-2"
              >
                Rhythm Complexity
              </label>
              <Slider
                id="rhythm-complexity"
                defaultValue={[3]}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-6">
        <Button size="lg">Generate New Score</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Display</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for the score display component */}
          <div className="bg-gray-200 h-64 flex items-center justify-center">
            Score will be displayed here
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
