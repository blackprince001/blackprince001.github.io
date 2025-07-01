import { intro, work, education, projects, openSource } from "../../lib/content"
import type { Intro } from "../../lib/content"
import { Copy } from "../../components/copy"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 max-w-4xl text-sm p-8 mx-auto">
      {/* <Intro intro={intro} /> */}

      <section className="grid gap-4 fade-in-up !delay-500">
        <h3>Education</h3>
        <div className="grid divide-y">
          {education.map((item) => (
            <Item key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 fade-in-up !delay-300">
        <h3>Work</h3>
        <div className="grid divide-y">
          {work.map((item) => (
            <Item key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 fade-in-up !delay-700">
        <h3>Captured Projects</h3>
        <div className="grid divide-y">
          {projects.map((item) => (
            <Item key={item.title} {...item} />
          ))}
        </div>

        More on projects can be found on the Projects page.
      </section>

      {/* <section className="grid gap-4 fade-in-up !delay-1000">
        <h3>Open Source</h3>
        <div className="grid divide-y">
          {openSource.map((item) => (
            <Item key={item.title} {...item} />
          ))}
        </div>
      </section> */}
    </main>
  );
}

// interface IntroProps {
//   intro: Intro;
// }

// function Intro({ intro }: IntroProps) {
//   return (
//     <section className="grid gap-4 justify-start text-left">
//       <h2 className="fade-in-up !delay-100 text-left">{intro.name}</h2>

//       <div className="dont-print flex gap-4 fade-in-up !delay-200 justify-start">
//         <a href={intro.github} target="_blank">
//           Github
//         </a>
//         <a href={intro.linkedin} target="_blank">
//           LinkedIn
//         </a>
//         <Copy text={intro.email}>Email</Copy>
//       </div>

//       <p className="text-muted-foreground max-w-prose fade-in-up !delay-300 text-left">
//         {intro.about}
//       </p>
//     </section>
//   );
// }

type ItemProps = {
  title: string;
  date?: string;
  description: string[];
  href?: string;
  location?: string;
};

function Item({ title, date, description, href, location }: ItemProps) {
  return (
    <section className="grid sm:grid-cols-[1fr_2fr] py-3 gap-5 sm:gap-2 px-3 -mx-3 hover:bg-muted/50 transition-all">
      <div>
        <h3 className="font-medium text-lg mb-4 sm:mb-0">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {date && (
          <p className="text-muted-foreground text-xs sm:text-sm">{date}</p>
        )}
        {location && (
          <p className="text-muted-foreground text-xs sm:text-sm">{location}</p>
        )}
      </div>
      <div className="grid gap-1">
        {description.map((item, i) => (
          <p key={i} className="text-muted-foreground text-base">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
