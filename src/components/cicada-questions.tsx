"use client"

import { useState, useEffect } from "react"

const questions = [
  {
    id: 1,
    question: "Observation changes the thing being observed.",
    type: "statement",
  },
  {
    id: 2,
    question: "Disregarding color blindness, any arbitrary color looks the same to all people.",
    type: "statement",
  },
  {
    id: 3,
    question: "Grass is only green due to a relationship between the grass, light, and your mind.",
    type: "statement",
  },
  {
    id: 4,
    question: "What you are is more important than what you do.",
    type: "statement",
  },
  {
    id: 5,
    question: "You cannot step into the same river twice.",
    type: "statement",
  },
  {
    id: 6,
    question:
      "We get hundreds of millions of sensations coming into our minds at any moment. Our brain can't process them all so it categorizes these signals according to our belief systems. This is why we find evidence to support our beliefs and rarely notice evidence to the contrary.",
    type: "statement",
  },
  {
    id: 7,
    question:
      'I am the voice* inside my head. *(You undoubtedly just thought "I don\'t have a voice in my head." That is the voice the question is referring to.)',
    type: "statement",
  },
  {
    id: 8,
    question: "1 = 0.999999...",
    type: "statement",
  },
  {
    id: 9,
    question: "There is no truth.",
    type: "statement",
  },
  {
    id: 10,
    question: "If A is not true, then it must be.",
    type: "statement",
  },
  {
    id: 11,
    question: "All things are true.",
    type: "statement",
  },
  {
    id: 12,
    question: "This sentence is false.",
    type: "statement",
  },
  {
    id: 13,
    question: "People who only study material *after* a test do better than those who do not study at all.",
    type: "statement",
  },
  {
    id: 14,
    question:
      'Two people are standing by a lake. One says, "that\'s a lovely reflection in the water." The other says "I see no reflection, but it\'s a fascinating assortment of fish, plants, and rocks within the water." Which one is lying?',
    type: "multipleChoice",
    options: ["The person who sees the reflection", "The person who sees the fish", "Both", "Neither"],
  },
  {
    id: 15,
    question: 'What does the word "it" refer to in the following sentence: It is dark outside?',
    type: "freeResponse",
  },
  {
    id: 16,
    question: "The mathematical operation known as addition is modeled after what?",
    type: "freeResponse",
  },
  {
    id: 17,
    question: 'Name similarities between reality and the concept of the "News Feed" on Facebook?',
    type: "freeResponse",
  },
  {
    id: 18,
    question:
      "Explain, in your own words, what mathematical principle is relied upon for the security of Shamir's Secret Sharing Scheme.",
    type: "freeResponse",
  },
  {
    id: 19,
    question:
      "In the programming language of your choice, write a function that returns a function that returns the value 3301.",
    type: "freeResponse",
  },
  {
    id: 20,
    question:
      "In the programming language of your choice, write a function that sums digits of a number until it is one digit, by calling itself.",
    type: "freeResponse",
  },
]

export default function CicadaQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)

  useEffect(() => {
    getRandomQuestion()
  }, [])

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length)
    setCurrentQuestion(questions[randomIndex])
  }

  if (!currentQuestion) return null

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">Challenge No.{currentQuestion.id}</h3>
      <div className="space-y-4">
        <p className="text-sm font-serif leading-relaxed">{currentQuestion.question}</p>
        <div className="text-xs text-muted-foreground mt-4 font-sans">
          <p className="mb-2">Response options:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>True</li>
            <li>False</li>
            <li>Indeterminate</li>
            <li>Meaningless</li>
            <li>Self-Referential</li>
            <li>Game Rule</li>
            <li>Strange Loop</li>
            <li>None of the above</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
