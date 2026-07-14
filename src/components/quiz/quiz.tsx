"use client"

import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useId, useState } from "react"
import { RichText } from "@/components/ui/latex"

interface QuizAnswer {
  text: string
  correct: boolean
}

interface QuizQuestion {
  question: string
  answers: QuizAnswer[]
  image?: string
  explanation?: string
}

interface QuizProps {
  quizData: QuizQuestion[]
}

export default function Quiz({ quizData }: QuizProps) {
  const labelId = useId()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number | undefined>>([])
  const [selection, setSelection] = useState<number | null>(null)
  const submitted = answers[questionIndex] !== undefined
  const question = quizData[questionIndex]

  if (!question) {
    return <p className="quiz__empty">This knowledge check has no questions yet.</p>
  }

  const moveTo = (nextIndex: number) => {
    setQuestionIndex(nextIndex)
    setSelection(answers[nextIndex] ?? null)
  }

  const submit = () => {
    if (selection === null) return
    setAnswers((current) => {
      const next = [...current]
      next[questionIndex] = selection
      return next
    })
  }

  const selectedAnswer = submitted ? answers[questionIndex] : selection
  const selectedIsCorrect = selectedAnswer !== undefined && selectedAnswer !== null
    ? question.answers[selectedAnswer]?.correct
    : false
  const answeredCount = answers.filter((answer) => answer !== undefined).length

  return (
    <section className="quiz" aria-labelledby={labelId}>
      <header className="quiz__header">
        <div>
          <p className="quiz__eyebrow">Knowledge check</p>
          <p className="quiz__progress">{questionIndex + 1} / {quizData.length}</p>
        </div>
        <div className="quiz__progress-track" aria-hidden="true">
          <span style={{ width: `${((questionIndex + 1) / quizData.length) * 100}%` }} />
        </div>
      </header>

      <div className="quiz__body">
        <h4 id={labelId} className="quiz__question"><RichText text={question.question} /></h4>
        {question.image && (
          <figure className="quiz__figure">
            <img src={question.image} alt="Diagram for this question" />
          </figure>
        )}
        <div className="quiz__answers" role="radiogroup" aria-labelledby={labelId}>
          {question.answers.map((answer, index) => {
            const selected = selectedAnswer === index
            const revealCorrect = submitted && answer.correct
            const revealIncorrect = submitted && selected && !answer.correct
            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={selected}
                className="quiz__answer"
                data-selected={selected || undefined}
                data-verdict={revealCorrect ? "correct" : revealIncorrect ? "incorrect" : undefined}
                disabled={submitted}
                onClick={() => setSelection(index)}
              >
                <span className="quiz__answer-index" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                <span className="quiz__answer-text"><RichText text={answer.text} /></span>
                {revealCorrect && <Check className="quiz__verdict" aria-hidden="true" />}
                {revealIncorrect && <X className="quiz__verdict" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <div className="quiz__feedback" role="status" aria-live="polite">
          {submitted && (
            <>
              <p className="quiz__feedback-title" data-correct={selectedIsCorrect || undefined}>
                {selectedIsCorrect ? "Correct" : "Not quite"}
              </p>
              {question.explanation && <div><RichText text={question.explanation} /></div>}
            </>
          )}
        </div>
      </div>

      <footer className="quiz__footer">
        <button type="button" className="component-button component-button--quiet" disabled={questionIndex === 0} onClick={() => moveTo(questionIndex - 1)}>
          <ChevronLeft aria-hidden="true" /> Previous
        </button>
        <span>{answeredCount} answered</span>
        {submitted ? (
          <button type="button" className="component-button" disabled={questionIndex === quizData.length - 1} onClick={() => moveTo(questionIndex + 1)}>
            Next <ChevronRight aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="component-button" disabled={selection === null} onClick={submit}>Check answer</button>
        )}
      </footer>
    </section>
  )
}
