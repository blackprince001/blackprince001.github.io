import {
  education,
  research,
  work,
  projects,
  writing,
  type ResumeItem,
} from "../../lib/content"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 py-16 sm:px-10">
        <ResumeSection
          title="Education"
          items={education}
          showDividers={false}
        />
        <ResumeSection title="Research Experience" items={research} />
        <ResumeSection title="Work Experience" items={work} />
        <ResumeSection
          title="Relevant Projects"
          items={projects}
          note="Explore detailed write-ups on the dedicated projects page."
        />
        <ResumeSection title="Writing" items={writing} />
      </div>
    </main>
  );
}

type ResumeSectionProps = {
  title: string;
  items: ResumeItem[];
  note?: string;
  showDividers?: boolean;
};

function ResumeSection({
  title,
  items,
  note,
  showDividers = true,
}: ResumeSectionProps) {
  return (
    <section className="space-y-5">
      <header className="space-y-3">
        {showDividers ? (
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 rounded-full bg-border" />
            <h2 className="shrink-0 text-sm font-semibold uppercase tracking-[0.25em] text-foreground">
              {title}
            </h2>
            <span className="h-px flex-1 rounded-full bg-border" />
          </div>
        ) : (
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">
            {title}
          </h2>
        )}
        {note && (
          <p className="text-xs text-muted-foreground text-center">{note}</p>
        )}
      </header>
      <div className="grid divide-y divide-border/60">
        {items.map((item) => (
          <Item key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

type ItemProps = {
  title: string;
  date?: string;
  description: string[];
  href?: string;
  location?: string;
};

function Item({ title, date, description, href, location }: ItemProps) {
  return (
    <article className="grid gap-5 py-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.85fr)] sm:gap-8">
      <div className="space-y-2 text-[15px] leading-relaxed text-foreground">
        <h3 className="font-medium">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {date && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {date}
          </p>
        )}
        {location && (
          <p className="text-xs text-muted-foreground">{location}</p>
        )}
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        {description.map((item, i) => (
          <p key={i} className="text-muted-foreground">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
