export interface Challenge {
  id: number;
  question: string;
  type: "statement" | "multipleChoice" | "freeResponse";
  options?: string[];
}

export const challenges: Challenge[] = [
  { id: 1, question: "Observation changes the thing being observed.", type: "statement" },
  { id: 2, question: "Disregarding color blindness, any arbitrary color looks the same to all people.", type: "statement" },
  { id: 3, question: "Grass is only green due to a relationship between the grass, light, and your mind.", type: "statement" },
  { id: 4, question: "What you are is more important than what you do.", type: "statement" },
  { id: 5, question: "You cannot step into the same river twice.", type: "statement" },
  { id: 6, question: "We get hundreds of millions of sensations at any moment. Our brain cannot process them all, so it categorizes these signals according to our belief systems. This is why we find evidence supporting our beliefs and rarely notice evidence to the contrary.", type: "statement" },
  { id: 7, question: "I am the voice inside my head. You undoubtedly just thought, ‘I don’t have a voice in my head.’ That is the voice the question is referring to.", type: "statement" },
  { id: 8, question: "1 = 0.999999...", type: "statement" },
  { id: 9, question: "There is no truth.", type: "statement" },
  { id: 10, question: "If A is not true, then it must be.", type: "statement" },
  { id: 11, question: "All things are true.", type: "statement" },
  { id: 12, question: "This sentence is false.", type: "statement" },
  { id: 13, question: "People who only study material after a test do better than those who do not study at all.", type: "statement" },
  { id: 14, question: "Two people are standing by a lake. One sees a reflection; the other sees only fish, plants, and rocks within the water. Which one is lying?", type: "multipleChoice", options: ["The person who sees the reflection", "The person who sees the fish", "Both", "Neither"] },
  { id: 15, question: "What does the word ‘it’ refer to in the sentence: It is dark outside?", type: "freeResponse" },
  { id: 16, question: "The mathematical operation known as addition is modeled after what?", type: "freeResponse" },
  { id: 17, question: "Name similarities between reality and the concept of the News Feed on Facebook.", type: "freeResponse" },
  { id: 18, question: "Explain what mathematical principle is relied upon for the security of Shamir’s Secret Sharing Scheme.", type: "freeResponse" },
  { id: 19, question: "In the programming language of your choice, write a function that returns a function that returns the value 3301.", type: "freeResponse" },
  { id: 20, question: "Write a recursive function that sums the digits of a number until only one digit remains.", type: "freeResponse" },
];
