"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { WebMidi, Input, NoteMessageEvent } from "webmidi";

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
  onNotePlay: (note: string, source: "midi" | "click") => void;
}

export function VirtualPiano({ onNotePlay }: VirtualPianoProps) {
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const onNotePlayRef = useRef(onNotePlay);

  useEffect(() => {
    onNotePlayRef.current = onNotePlay;
  }, [onNotePlay]);

  const handleNotePlay = useCallback(
    (note: string, source: "midi" | "click") => {
      if (typeof onNotePlayRef.current === "function") {
        onNotePlayRef.current(note, source);
      }
      setPressedKey(note);
      setTimeout(() => setPressedKey(null), 200); // Reset after 200ms
    },
    []
  );

  useEffect(() => {
    let midiInputs: Input[] = [];

    // Enable WebMidi
    WebMidi.enable()
      .then(() => {
        console.log("WebMidi enabled!");
        setMidiEnabled(true);

        // Listen to all MIDI inputs
        midiInputs = WebMidi.inputs;
        midiInputs.forEach((input) => {
          input.addListener("noteon", (e: NoteMessageEvent) => {
            const noteName = e.note.name;
            handleNotePlay(noteName, "midi");
          });
        });
      })
      .catch((err) => console.log("WebMidi could not be enabled.", err));

    // Cleanup function
    return () => {
      midiInputs.forEach((input) => {
        input.removeListener("noteon");
      });
      WebMidi.disable();
    };
  }, [handleNotePlay]);

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
            } flex items-end justify-center pb-2 ${
              pressedKey === note ? "bg-blue-300" : ""
            } transition-colors duration-200`}
            onClick={() => handleNotePlay(note, "click")}
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
      {midiEnabled && (
        <p className="text-center text-green-600">MIDI keyboard connected</p>
      )}
    </div>
  );
}
