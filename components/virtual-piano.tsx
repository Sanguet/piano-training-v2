"use client"

import { Button } from "@/components/ui/button";

const keys = [
  { note: "C", color: "white" },
  { note: "C#", color: "black" },
  { note: "D", color: "white" },
  { note: "D#", color: "black" },
  { note: "E", color: "white" },
  { note: "F", color: "white" },
  { note: "F#", color: "black" },
  { note: "G", color: "white" },
  { note: "G#", color: "black" },
  { note: "A", color: "white" },
  { note: "A#", color: "black" },
  { note: "B", color: "white" },
];

interface VirtualPianoProps {
  onNotePlay: (note: string) => void;
}

export function VirtualPiano({ onNotePlay }: VirtualPianoProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-4 relative">
        {keys.map(({ note, color }) => (
          <Button
            key={note}
            className={`w-12 h-40 ${
              color === "white" ? "bg-white" : "bg-black"
            } border border-gray-300 ${
              color === "black" ? "relative -mx-6 z-10 h-28" : ""
            } flex items-end justify-center pb-2`}
            onClick={() => onNotePlay(note)}
          >
            <span
              className={`text-xs opacity-50 ${
                color === "white" ? "text-black" : "text-white"
              }`}
            >
              {note}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
