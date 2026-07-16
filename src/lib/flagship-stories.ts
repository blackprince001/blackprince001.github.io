export interface FlagshipResource {
  label: string;
  url: string;
}

export interface FlagshipMetric {
  value: string;
  label: string;
  context: string;
}

export interface FlagshipChapter {
  id: string;
  index: string;
  title: string;
  paragraphs: string[];
  media: { src: string; alt: string; caption: string };
}

export interface FlagshipStory {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  tags: string[];
  hero: { src: string; alt: string };
  resources: FlagshipResource[];
  metrics: FlagshipMetric[];
  chapters: FlagshipChapter[];
}

export const flagshipStories: FlagshipStory[] = [
  {
    slug: "oware",
    eyebrow: "Reinforcement learning · Game systems",
    title: "An Oware engine and a ladder of learning agents",
    summary: "A rules-correct Abapa engine became a controlled arena for Minimax, DQN, PPO, and AlphaZero-lite—and a record of why some agents failed more instructively than others.",
    tags: ["Reinforcement Learning", "DQN", "PPO", "AlphaZero"],
    hero: { src: "/featured-projects/oware-1.png", alt: "Oware game interface with two rows of houses and agent controls" },
    resources: [
      { label: "Full write-up", url: "/blog/oware" },
      { label: "Source", url: "https://github.com/blackprince001/oware" },
      { label: "Play", url: "https://oware-ai.vercel.app/#/" },
    ],
    metrics: [
      { value: "7", label: "agents evaluated", context: "Search, learned, random, and self-play policies." },
      { value: "100", label: "games per pairing", context: "A complete round-robin comparison." },
      { value: "1,171", label: "DQN Elo", context: "Second only to the depth-six Minimax baseline." },
    ],
    chapters: [
      {
        id: "engine",
        index: "01",
        title: "Make the rules trustworthy first",
        paragraphs: [
          "The engine models Abapa as immutable state: twelve houses, two stores, the side to move, and capture history. Starvation, source-house skipping, and backwards capture are resolved before an agent sees the position.",
          "That narrow contract lets every policy share the same server, tournament, and evaluation surface. A search baseline and a neural agent differ only in how they choose a legal move.",
        ],
        media: { src: "/featured-projects/oware-2.png", alt: "Oware board during play", caption: "One engine contract supports human play, search, self-play, and evaluation." },
      },
      {
        id: "agents",
        index: "02",
        title: "Let each family fail honestly",
        paragraphs: [
          "DQN learned efficiently but forgot an early curriculum opponent. PPO preserved healthy entropy while its league became too inward-facing. AlphaZero-lite stopped before its replay buffer and value head crossed a useful competence threshold.",
          "The shared evaluation protocol makes those diagnoses comparable. Smooth loss curves are evidence, but they are not treated as proof of playing strength.",
        ],
        media: { src: "/oware/dqn_training.png", alt: "DQN loss and opponent win-rate training curves", caption: "The training trace exposes both convergence and curriculum forgetting." },
      },
      {
        id: "tournament",
        index: "03",
        title: "Settle the hierarchy on the board",
        paragraphs: [
          "A 100-game-per-pair round robin turns model claims into outcomes. Minimax-d6 leads, DQN finishes second, PPO trails it by 245 Elo, and the under-trained AlphaZero-lite lands below Random.",
          "The ranking is not a victory lap. It is the compact result of the system: reproducible opponents, bounded inference, and enough evidence to say what should be trained differently next.",
        ],
        media: { src: "/oware/elo_tournament.png", alt: "Bar chart of Oware agent Elo ratings", caption: "Tournament Elo keeps the story anchored to head-to-head play." },
      },
    ],
  },
  {
    slug: "floodit",
    eyebrow: "Reinforcement learning · Interactive systems",
    title: "A transparent DQN for territory capture",
    summary: "A Flood-It agent moves from a categorical board representation to a deployed opponent that exposes the Q-value behind every available color.",
    tags: ["Reinforcement Learning", "DQN", "React", "FastAPI"],
    hero: { src: "/featured-projects/floodit-1.png", alt: "Flood-It board with colored territories and live AI controls" },
    resources: [
      { label: "Full write-up", url: "/blog/floodit" },
      { label: "Source", url: "https://github.com/blackprince001/rl-filler" },
      { label: "Play", url: "https://floodit-ai.vercel.app/#/play" },
    ],
    metrics: [
      { value: "46", label: "game win streak", context: "The trained policy against random opponents." },
      { value: "6", label: "discrete actions", context: "One Q-value for each board color." },
      { value: "3", label: "system layers", context: "Environment, inference service, and web client." },
    ],
    chapters: [
      {
        id: "representation",
        index: "01",
        title: "Represent color as structure",
        paragraphs: [
          "Each board becomes an H × W × C one-hot tensor. Color identity stays categorical while the network can still learn which regions touch, expand, and threaten the opposing corner.",
          "The six-color action space stays small, but useful play requires spatial planning rather than a reflexive preference for the largest immediate capture.",
        ],
        media: { src: "/rl-filler/architecture.png", alt: "Flood-It training and deployment architecture", caption: "A shared environment contract connects training, inference, and the browser." },
      },
      {
        id: "policy",
        index: "02",
        title: "Train the policy, then inspect it",
        paragraphs: [
          "The DQN learns from replayed transitions and produces a score for every color. Instead of hiding that vector behind a single move, the product surfaces it beside the board.",
          "That decision trace turns the deployment into an inspection tool: visitors can see when the chosen move is decisive, marginal, or constrained by an invalid color.",
        ],
        media: { src: "/rl-filler/q-value.png", alt: "Flood-It interface showing Q-values for each available color", caption: "Live Q-values make the policy legible without pretending to explain the network itself." },
      },
      {
        id: "deployment",
        index: "03",
        title: "Correct perspective at the boundary",
        paragraphs: [
          "The trained model expected one corner, while a human opponent could occupy the mirrored side. The service corrects that mismatch by flipping the tensor before inference and mapping the decision back afterwards.",
          "FastAPI and WebSockets keep the model state synchronized with a React client, preserving one source of game truth while moves and decision scores update in real time.",
        ],
        media: { src: "/featured-projects/floodit-2.png", alt: "Deployed Flood-It web application during a game", caption: "The deployed system keeps gameplay and model evidence on the same surface." },
      },
    ],
  },
];
