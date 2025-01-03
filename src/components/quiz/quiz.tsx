"use client"; // Mark this as a client component

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Provider,
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  useStore,
  createStore,
} from "jotai";
import React from "react";

// Atoms for state management
const finalAnswersAtom = atom<number[]>([]); // Stores user's answers
const currentQuestionAtom = atom(0); // Tracks the current question index
const selectedAnswerAtom = atom<number | null>(null); // Tracks the selected answer
const submittedAtom = atom(false); // Tracks if the current question is submitted

// Custom store for Jotai
const customStore = createStore();

// Atom to handle submitted answers
const handleSubmittedAnswerAtom = atom(null, (get, set, answerIndex: number) => {
  const currentQuestion = get(currentQuestionAtom);
  set(finalAnswersAtom, (prev) => {
    const updatedAnswers = [...prev];
    updatedAnswers[currentQuestion] = answerIndex;
    return updatedAnswers;
  });
});

interface QuizAnswer {
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  question: string;
  answers: QuizAnswer[];
  explanation?: string;
}

interface QuizProps {
  quizData: QuizQuestion[];
}

// Quiz Component
const Quiz = ({ quizData }: QuizProps) => {
  const store = useStore();
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom, {
    store,
  });
  const [selectedAnswer, setSelectedAnswer] = useAtom(selectedAnswerAtom, {
    store,
  });
  const finalAnswers = useAtomValue(finalAnswersAtom, { store });
  const submitAnswer = useSetAtom(handleSubmittedAnswerAtom, { store });
  const [submitted, setSubmitted] = useAtom(submittedAtom, { store });

  const canMoveOn = submitted || selectedAnswer === null;

  const handleQuestionChange = (newQuestionIndex: number) => {
    const newAnswer = finalAnswers[newQuestionIndex] ?? null;
    setCurrentQuestion(newQuestionIndex);
    setSubmitted(newAnswer !== null);
    setSelectedAnswer(newAnswer);
  };

  const currentQuestionData = quizData[currentQuestion];

  return (
    <div className="quiz my-8">
      <div className="space-y-4">
        <h3 className="text-[1.5rem] font-semibold mb-4 text-[#f5f5f5]">
          {currentQuestionData.question}
        </h3>
        <div className="space-y-2">
          {currentQuestionData.answers.map((answer, index) => (
            <QuizMCAnswer
              key={index}
              correct={answer.correct}
              isSelected={selectedAnswer === index}
              showVerdict={submitted && (selectedAnswer === index || answer.correct)}
              onClick={() => {
                if (!submitted) {
                  setSelectedAnswer(index);
                }
              }}
            >
              {answer.text}
            </QuizMCAnswer>
          ))}
        </div>
        {submitted && currentQuestionData.explanation && (
          <div className="text-sm text-[#a0a0a0] mt-4">
            {currentQuestionData.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          className="btn bg-[#2a2a2a] text-[#f5f5f5] px-4 py-2 rounded-lg hover:bg-[#333333] transition-colors"
          disabled={currentQuestion === 0}
          onClick={() => handleQuestionChange(currentQuestion - 1)}
        >
          <ArrowLeft className="-ml-0.5 mr-2 h-4 w-4" /> Previous
        </button>
        <span className="text-[#a0a0a0]">
          Question {currentQuestion + 1} of {quizData.length}
        </span>
        <button
          className="btn bg-[#2a2a2a] text-[#f5f5f5] px-4 py-2 rounded-lg hover:bg-[#333333] transition-colors"
          disabled={canMoveOn && currentQuestion === quizData.length - 1}
          onClick={() => {
            if (!canMoveOn) {
              submitAnswer(selectedAnswer ?? -1);
              setSubmitted(true);
            } else {
              handleQuestionChange(currentQuestion + 1);
            }
          }}
        >
          {selectedAnswer === null ? "Skip" : submitted ? "Next" : "Submit"}{" "}
          {canMoveOn && <ArrowRight className="-mr-0.5 ml-2 h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

// QuizMCAnswer Component
interface QuizMCAnswerProps {
  correct?: boolean;
  isSelected: boolean;
  showVerdict: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const QuizMCAnswer = ({
  correct,
  isSelected,
  showVerdict,
  onClick,
  children,
}: QuizMCAnswerProps) => {
  return (
    <button
      className={`flex w-full items-start bg-[#2a2a2a] rounded-lg px-4 py-3 text-left focus:outline-none ${
        showVerdict
          ? correct
            ? "ring-2 ring-green-600 bg-[#1a1a1a]"
            : "ring-2 ring-red-600 bg-[#1a1a1a]"
          : ""
      } ${
        isSelected && !showVerdict
          ? "ring-2 ring-[#3b82f6] bg-[#1a1a1a]"
          : "hover:bg-[#333333] transition-colors"
      }`}
      onClick={onClick}
      disabled={showVerdict}
    >
      <span
        className={`
          flex-shrink-0 h-6 w-6 rounded-full font-medium inline-flex items-center justify-center
          ${
            isSelected || showVerdict
              ? "ring-2 ring-offset-2 ring-offset-[#2a2a2a] text-[#f5f5f5] font-bold"
              : "border border-[#333333] text-[#a0a0a0]"
          }
          ${
            showVerdict
              ? correct
                ? "ring-green-600 bg-green-600"
                : "ring-red-600 bg-red-600"
              : ""
          }
          ${
            isSelected && !showVerdict
              ? "ring-[#3b82f6] bg-[#3b82f6]"
              : ""
          }
        `}
      >
      </span>
      <div className="flex-1 ml-3 text-[#f5f5f5]">{children}</div>
    </button>
  );
};

export default Quiz;