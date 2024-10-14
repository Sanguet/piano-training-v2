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
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const onNotePlayRef = useRef(onNotePlay);

  useEffect(() => {
    onNotePlayRef.current = onNotePlay;
  }, [onNotePlay]);

  const handleNotePlay = useCallback(
    (note: string, source: "midi" | "click") => {
      if (typeof onNotePlayRef.current === "function") {
        onNotePlayRef.current(note, source);
      }
      setPressedKeys((prev) => new Set(prev).add(note));
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }, 200); // Reset after 200ms
    },
    []
  );

  useEffect(() => {
    let midiInputs: Input[] = [];

    const enableWebMidi = async () => {
      try {
        await WebMidi.enable({ sysex: true });
        console.log("WebMidi enabled!");
        setMidiEnabled(true);

        midiInputs = WebMidi.inputs;
        midiInputs.forEach((input) => {
          input.addListener("noteon", (e: NoteMessageEvent) => {
            if (e.note && e.note.name) {
              const noteName = e.note.name;
              const fullNoteName = `${noteName}${e.note.accidental || ""}`;
              handleNotePlay(fullNoteName, "midi");
            }
          });
        });
      } catch (err) {
        console.error("WebMidi could not be enabled.", err);
        setMidiEnabled(false);
      }
    };

    enableWebMidi();

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
              pressedKeys.has(note) ? "bg-blue-300" : ""
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
      {midiEnabled ? (
        <p className="text-center text-green-600">MIDI keyboard connected</p>
      ) : (
        <p className="text-center text-yellow-600">
          MIDI keyboard not detected
        </p>
      )}
    </div>
  );
}
