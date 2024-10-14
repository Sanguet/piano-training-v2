"use client"

import React, { useEffect, useRef, useState } from "react";
import { Factory } from "vexflow";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtualPiano } from "@/components/virtual-piano";
import { CheckCircle2, XCircle, ArrowUp, ArrowDown } from "lucide-react";

interface NoteRecognitionProps {
  onExerciseComplete: (correctAnswers: number, wrongAnswers: number) => void;
}

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
  const [timer, setTimer] = useState(10); // Changed from 30 to 10 seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const FEEDBACK_DURATION = 2000;

  useEffect(() => {
    if (isExerciseActive && countdown === 0) {
      renderNote();
    }
  }, [currentNote, isExerciseActive, countdown]);

  useEffect(() => {
    if (feedback.status) {
      setIsFeedbackVisible(true);
      const timer = setTimeout(() => {
        setIsFeedbackVisible(false);
      }, FEEDBACK_DURATION - 300);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | undefined;
    if (isExerciseActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isExerciseActive && countdown === 0) {
      if (countdownInterval) clearInterval(countdownInterval);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsExerciseActive(false);
            onExerciseComplete(score, wrongAnswers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExerciseActive, countdown, onExerciseComplete]);

  const renderNote = () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const vf = new Factory({
        renderer: {
          elementId: containerRef.current.id,
          width: 300,
          height: 160,
        },
      });

      const score = vf.EasyScore();
      const system = vf.System({
        width: 250,
        x: 25,
        y: 40,
      });

      system
        .addStave({
          voices: [score.voice(score.notes(currentNote + "/w"))],
        })
        .addClef("treble");

      vf.draw();
    }
  };

  const playNote = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(currentNote, "0.2");
  };

  const checkAnswer = (guessedNote: string) => {
    if (!isExerciseActive || countdown > 0) return;

    const currentNoteIndex = "CDEFGAB".indexOf(currentNote[0]);
    const guessedNoteIndex = "CDEFGAB".indexOf(guessedNote[0]);

    if (guessedNote === currentNote[0]) {
      setScore((prevScore) => prevScore + 1);
      setFeedback({ status: "correct", message: "Correct! Well done!" });
      setCurrentNote(getRandomNote());
    } else {
      setWrongAnswers((prev) => prev + 1);
      const hint = guessedNoteIndex < currentNoteIndex ? "higher" : "lower";
      setFeedback({
        status: "incorrect",
        message: `Incorrect. Try a ${hint} note.`,
      });
    }
  };

  const getRandomNote = (): string => {
    const notes = [
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
    return notes[Math.floor(Math.random() * notes.length)];
  };

  const startExercise = () => {
    setIsExerciseActive(true);
    setCountdown(3);
    setScore(0);
    setWrongAnswers(0);
    setCurrentNote(getRandomNote());
    setTimer(10); // Changed from 30 to 10 seconds
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Note Recognition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExerciseActive ? (
          <Button onClick={startExercise} className="w-full">
            Start Exercise
          </Button>
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
              className="flex justify-center"
            ></div>
            <div className="max-w-[384px] mx-auto">
              <Button onClick={playNote} className="w-full mb-4">
                Play Note
              </Button>
              <VirtualPiano onNotePlay={checkAnswer} />
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

export default NoteRecognition;
