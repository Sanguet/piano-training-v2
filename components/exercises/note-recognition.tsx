"use client"

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Factory, Stave, StaveNote } from "vexflow";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtualPiano } from "@/components/virtual-piano";
import { CheckCircle2, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteRecognitionProps {
  onExerciseComplete: (correctAnswers: number, wrongAnswers: number) => void;
}

type ClefType = "treble" | "bass";

const NoteRecognition: React.FC<NoteRecognitionProps> = ({
  onExerciseComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentNote, setCurrentNote] = useState<string>("C4");
  const [score, setScore] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    status: "correct" | "incorrect" | null;
    message: string;
  }>({ status: null, message: "" });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [clefType, setClefType] = useState<ClefType>("treble");

  const FEEDBACK_DURATION = 2000;

  const scoreRef = useRef<number>(score);
  const wrongAnswersRef = useRef<number>(wrongAnswers);

  const lastAnswerTimeRef = useRef<number>(0);
  const DEBOUNCE_TIME = 300; // 300ms debounce time

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    wrongAnswersRef.current = wrongAnswers;
  }, [wrongAnswers]);

  const renderNote = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const vf = new Factory({
        renderer: {
          elementId: containerRef.current.id,
          width: 400,
          height: 160,
        },
      });

      const context = vf.getContext();
      const system = vf.System({
        width: 350,
        x: 25,
        y: 40,
      });

      // Convert the note format
      const [noteName, octave] = currentNote.split("");
      const vexflowNote = `${noteName.toLowerCase()}/${octave}`;

      system
        .addStave({
          voices: [
            vf.Voice().addTickables([
              new StaveNote({
                keys: [vexflowNote],
                duration: "w",
                clef: clefType,
              }),
            ]),
          ],
        })
        .addClef(clefType)
        .addTimeSignature("4/4");

      vf.draw();
    }
  }, [currentNote, clefType]);

  const playNote = useCallback(async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(currentNote, "0.2");
  }, [currentNote]);

  const getRandomNote = useCallback((): string => {
    const trebleNotes = [
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "B4",
      "C5",
      "D5",
      "E5",
      "F5",
      "G5",
      "A5",
      "B5",
    ];
    const bassNotes = [
      "C2",
      "D2",
      "E2",
      "F2",
      "G2",
      "A2",
      "B2",
      "C3",
      "D3",
      "E3",
      "F3",
      "G3",
      "A3",
      "B3",
    ];
    const notes = clefType === "treble" ? trebleNotes : bassNotes;

    let newNote: string;
    do {
      newNote = notes[Math.floor(Math.random() * notes.length)];
    } while (newNote === currentNote);

    return newNote;
  }, [clefType, currentNote]);

  const checkAnswer = useCallback(
    (guessedNote: string, source: "midi" | "click") => {
      if (!isExerciseActive || countdown > 0) return;

      const now = Date.now();
      if (now - lastAnswerTimeRef.current < DEBOUNCE_TIME) {
        // Ignore this input if it's too soon after the last one
        return;
      }
      lastAnswerTimeRef.current = now;

      // Extract just the note name (without octave) for comparison
      const currentNoteName = currentNote.slice(0, -1);
      const guessedNoteName = guessedNote.slice(0, -1);

      if (guessedNoteName === currentNoteName) {
        setScore((prevScore) => prevScore + 1);
        setFeedback({ status: "correct", message: "Correct! Well done!" });
        setCurrentNote(getRandomNote());
      } else {
        setWrongAnswers((prev) => prev + 1);
        const currentNoteIndex = FULL_OCTAVE.indexOf(currentNoteName);
        const guessedNoteIndex = FULL_OCTAVE.indexOf(guessedNoteName);
        const hint = guessedNoteIndex < currentNoteIndex ? "higher" : "lower";
        setFeedback({
          status: "incorrect",
          message: `Incorrect. Try a ${hint} note.`,
        });
      }
    },
    [currentNote, isExerciseActive, countdown, getRandomNote]
  );

  const startExercise = useCallback(() => {
    setIsExerciseActive(true);
    setCountdown(3);
    setScore(0);
    setWrongAnswers(0);
    setCurrentNote(getRandomNote());
    setTimer(10);
  }, [getRandomNote]);

  useEffect(() => {
    if (isExerciseActive && countdown === 0) {
      renderNote();
    }
  }, [isExerciseActive, countdown, renderNote]);

  useEffect(() => {
    if (feedback.status) {
      setIsFeedbackVisible(true);
      const feedbackTimer = setTimeout(() => {
        setIsFeedbackVisible(false);
      }, FEEDBACK_DURATION - 300);
      return () => clearTimeout(feedbackTimer);
    }
  }, [feedback]);

  useEffect(() => {
    if (isExerciseActive) {
      if (countdown > 0) {
        countdownRef.current = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsExerciseActive(false);
              onExerciseComplete(scoreRef.current, wrongAnswersRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExerciseActive, countdown, onExerciseComplete]);

  const handleNotePlay = useCallback(
    (note: string, source: "midi" | "click") => {
      checkAnswer(note, source);
    },
    [checkAnswer]
  );

  const memoizedVirtualPiano = useMemo(() => {
    const pianoRange =
      clefType === "treble"
        ? { startNote: "C4", endNote: "C6" }
        : { startNote: "C2", endNote: "C4" };

    return (
      <VirtualPiano
        onNotePlay={handleNotePlay}
        startNote={pianoRange.startNote}
        endNote={pianoRange.endNote}
      />
    );
  }, [handleNotePlay, clefType]);

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>
          Note Recognition -{" "}
          {clefType === "treble" ? "Treble Clef" : "Bass Clef"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExerciseActive ? (
          <>
            <Select
              value={clefType}
              onValueChange={(value: ClefType) => setClefType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select clef type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="treble">Treble Clef</SelectItem>
                <SelectItem value="bass">Bass Clef</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={startExercise} className="w-full">
              Start Exercise
            </Button>
          </>
        ) : countdown > 0 ? (
          <div className="text-center text-2xl font-bold">
            Starting in {countdown}...
          </div>
        ) : (
          <>
            <div className="text-center text-xl font-semibold">
              Time remaining: {timer} seconds
            </div>
            <div
              ref={containerRef}
              id="vexflow-container"
              className="flex justify-center overflow-x-auto"
            ></div>
            <div className="w-full overflow-x-auto py-4">
              <div className="max-w-[500px] mx-auto">
                <Button onClick={playNote} className="w-full mb-4">
                  Play Note
                </Button>
                {memoizedVirtualPiano}
              </div>
            </div>
            <p className="text-center text-lg font-semibold">
              Score: {score} | Wrong Answers: {wrongAnswers}
            </p>
            <div
              className={`transition-opacity duration-300 ${
                isFeedbackVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {feedback.status && (
                <div
                  className={`text-center p-2 rounded ${
                    feedback.status === "correct"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {feedback.status === "correct" ? (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    ) : feedback.message.includes("higher") ? (
                      <ArrowUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="mr-2 h-4 w-4" />
                    )}
                    {feedback.message}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

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

export default NoteRecognition;
