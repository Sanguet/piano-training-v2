import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  id: string;
  score: number;
  wrongAnswers: number;
  date: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onReset: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onReset }) => {
  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {entries.map((entry, index) => (
            <li key={entry.id} className="flex items-center">
              <span className="w-8 font-bold text-lg flex items-center">
                {getMedalEmoji(index) || `${index + 1}.`}
              </span>
              <div className="flex-1 flex justify-between items-center">
                <span className="font-semibold">Score: {entry.score}</span>
                <span className="text-sm text-gray-500">
                  Wrong: {entry.wrongAnswers}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onReset}
          className="w-full bg-red-200 hover:bg-red-300 text-red-800"
        >
          Reset Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Leaderboard;
