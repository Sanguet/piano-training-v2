"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { WebMidi, Input, NoteMessageEvent } from "webmidi";

const FULL_OCTAVE = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

interface Key {
  note: string;
  octave: number;
  color: "white" | "black";
}

interface VirtualPianoProps {
  onNotePlay: (note: string, source: "midi" | "click") => void;
  startNote?: string;
  endNote?: string;
}

export function VirtualPiano({
  onNotePlay,
  startNote = "A0",
  endNote = "C8",
}: VirtualPianoProps) {
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const onNotePlayRef = useRef(onNotePlay);

  useEffect(() => {
    onNotePlayRef.current = onNotePlay;
  }, [onNotePlay]);

  const generateKeys = useCallback((): Key[] => {
    const keys: Key[] = [];
    const [startNoteName, startOctave] = startNote.split(/(\d+)/);
    const [endNoteName, endOctave] = endNote.split(/(\d+)/);
    let currentOctave = parseInt(startOctave);
    let startIndex = FULL_OCTAVE.indexOf(startNoteName);

    while (currentOctave <= parseInt(endOctave)) {
      for (let i = startIndex; i < FULL_OCTAVE.length; i++) {
        const note = FULL_OCTAVE[i];
        keys.push({
          note: `${note}${currentOctave}`,
          octave: currentOctave,
          color: note.includes("#") ? "black" : "white",
        });
        if (currentOctave === parseInt(endOctave) && note === endNoteName) {
          return keys;
        }
      }
      currentOctave++;
      startIndex = 0;
    }
    return keys;
  }, [startNote, endNote]);

  const keys = generateKeys();

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
          input.addListener("noteon", "all", (e: NoteMessageEvent) => {
            try {
              if (e.note && e.note.name && e.note.octave !== undefined) {
                const noteName = e.note.name;
                const fullNoteName = `${noteName}${e.note.accidental || ""}${
                  e.note.octave
                }`;
                handleNotePlay(fullNoteName, "midi");
              } else {
                console.warn("Received incomplete MIDI note data:", e);
              }
            } catch (error) {
              console.error("Error processing MIDI note:", error);
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
    <div className="max-w-full mx-auto overflow-x-auto">
      <div className="flex justify-start mb-4 relative">
        {keys.map(({ note, color }) => (
          <Button
            key={note}
            className={`w-8 h-32 ${
              color === "white" ? "bg-white" : "bg-black"
            } border border-gray-300 ${
              color === "black" ? "relative -mx-4 z-10 h-20" : ""
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
