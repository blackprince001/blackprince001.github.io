import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_ROOT = path.join(ROOT, "public/images/og");
const FONT_REGULAR = path.join(ROOT, "src/assets/og/fonts/Inter-Regular.ttf");
const FONT_BOLD = path.join(ROOT, "src/assets/og/fonts/Inter-Bold.ttf");

const COLORS = {
  blue: "#0b45b8",
  ink: "#f7f9ff",
  muted: "#cbd8ff",
  grid: "#f7f9ff",
  orange: "#ff6b1a",
};

const sectionCards = [
  {
    file: "home.png",
    section: "Home",
    title: "blackprince",
    description: "Systems · AI / Robotics · Learning",
  },
  {
    file: "writing.png",
    section: "Writing",
    title: "Research notes & engineering essays",
    description: "Long-form thinking on intelligent systems, robotics, and software.",
  },
  {
    file: "shorts.png",
    section: "Shorts",
    title: "Short notes, open questions, unfinished thoughts",
    description: "Ideas small enough to share before they become essays.",
  },
  {
    file: "projects.png",
    section: "Projects",
    title: "Systems built to answer real questions",
    description: "Selected engineering work, research prototypes, and experiments.",
  },
  {
    file: "manuscripts.png",
    section: "Manuscripts",
    title: "Research, written down",
    description: "Technical publications and manuscripts, collected in one place.",
  },
  {
    file: "reading.png",
    section: "Reading",
    title: "Books that leave a mark",
    description: "A working shelf across engineering, science, fiction, and philosophy.",
  },
  {
    file: "default.png",
    section: "Home",
    title: "blackprince",
    description: "Systems · AI / Robotics · Learning",
  },
];

function element(type, style, children) {
  return {
    type,
    props: {
      style,
      ...(typeof children === "string" ? { children } : { children }),
    },
  };
}

function titleSize(title) {
  if (title.length <= 14) return 96;
  if (title.length <= 32) return 78;
  if (title.length <= 52) return 66;
  if (title.length <= 74) return 56;
  return 48;
}

function gridLines() {
  const lines = [];

  for (let x = 24; x < WIDTH; x += 24) {
    lines.push(element("div", {
      position: "absolute",
      left: x,
      top: 0,
      width: 1,
      height: HEIGHT,
      backgroundColor: COLORS.grid,
      opacity: 0.14,
    }, ""));
  }

  for (let y = 24; y < HEIGHT; y += 24) {
    lines.push(element("div", {
      position: "absolute",
      left: 0,
      top: y,
      width: WIDTH,
      height: 1,
      backgroundColor: COLORS.grid,
      opacity: 0.14,
    }, ""));
  }

  return lines;
}

function cardMarkup(card) {
  return element("div", {
    width: WIDTH,
    height: HEIGHT,
    display: "flex",
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    color: COLORS.ink,
    fontFamily: "Inter",
  }, [
    ...gridLines(),
    element("div", {
      position: "absolute",
      left: 28,
      top: 28,
      width: 22,
      height: 22,
      borderTop: `2px solid ${COLORS.ink}`,
      borderLeft: `2px solid ${COLORS.ink}`,
    }, ""),
    element("div", {
      position: "absolute",
      right: 28,
      top: 28,
      width: 22,
      height: 22,
      borderTop: `2px solid ${COLORS.ink}`,
      borderRight: `2px solid ${COLORS.ink}`,
    }, ""),
    element("div", {
      position: "absolute",
      left: 28,
      bottom: 28,
      width: 22,
      height: 22,
      borderBottom: `2px solid ${COLORS.ink}`,
      borderLeft: `2px solid ${COLORS.ink}`,
    }, ""),
    element("div", {
      position: "absolute",
      right: 28,
      bottom: 28,
      width: 22,
      height: 22,
      borderRight: `2px solid ${COLORS.ink}`,
      borderBottom: `2px solid ${COLORS.ink}`,
    }, ""),
    element("div", {
      position: "absolute",
      left: 0,
      top: 0,
      width: WIDTH,
      height: HEIGHT,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 96px",
      textAlign: "center",
    }, [
      element("div", {
        display: "flex",
        alignItems: "center",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }, [
        element("div", {
          width: 9,
          height: 9,
          marginRight: 12,
          border: `2px solid ${COLORS.orange}`,
          borderRadius: 999,
        }, ""),
        card.section,
      ]),
      element("div", {
        display: "flex",
        justifyContent: "center",
        width: 980,
        marginTop: 27,
        fontSize: titleSize(card.title),
        fontWeight: 700,
        letterSpacing: "-0.055em",
        lineHeight: 0.94,
      }, card.title),
      element("div", {
        display: "flex",
        justifyContent: "center",
        width: 820,
        marginTop: 25,
        fontSize: 23,
        fontWeight: 400,
        lineHeight: 1.3,
        color: COLORS.muted,
      }, card.description),
      element("div", {
        display: "flex",
        marginTop: 34,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.17em",
        textTransform: "uppercase",
      }, "Prince Kwabena Appiah Boadu"),
    ]),
  ]);
}

function getFrontmatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^(['"])(.*)\1$/, "$2");
}

async function contentCards(directory, section, outputDirectory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const cards = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const source = await fs.readFile(path.join(directory, entry.name), "utf8");
    const title = getFrontmatterValue(source, "title");
    if (!title) continue;

    const description =
      getFrontmatterValue(source, "description") ??
      (section === "Writing"
        ? "An engineering field note on systems, intelligence, and building."
        : "A short note, open question, or unfinished thought.");

    cards.push({
      file: path.join(outputDirectory, `${path.parse(entry.name).name}.png`),
      section,
      title,
      description,
    });
  }

  return cards;
}

async function generate() {
  const [fontRegular, fontBold] = await Promise.all([
    fs.readFile(FONT_REGULAR),
    fs.readFile(FONT_BOLD),
  ]);

  const cards = [
    ...sectionCards,
    ...(await contentCards(path.join(ROOT, "src/content"), "Writing", "writing")),
    ...(await contentCards(path.join(ROOT, "src/content/shorts"), "Shorts", "shorts")),
  ];

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  for (const card of cards) {
    const svg = await satori(cardMarkup(card), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    });
    const destination = path.join(OUTPUT_ROOT, card.file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9, palette: true, quality: 92 })
      .toFile(destination);
  }

  console.log(`Generated ${cards.length} social images in public/images/og`);
}

await generate();
