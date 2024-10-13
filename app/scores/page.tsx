"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function ScoresPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Music Scores</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="score-file">Select File</Label>
              <Input
                id="score-file"
                type="file"
                accept=".musicxml,.midi,.mid"
              />
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Score
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This is a placeholder. In a real app, you'd map over actual score data */}
            {["Score 1", "Score 2", "Score 3"].map((score, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{score}</span>
                <div>
                  <Button variant="outline" className="mr-2">
                    View
                  </Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
