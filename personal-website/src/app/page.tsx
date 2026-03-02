import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { flagshipProjects } from "@/lib/projects";

const coreRoles = [
  {
    title: "Backend developer",
    detail: "API design, data contracts",
  },
  {
    title: "Data engineer",
    detail: "Pipelines, semantic layers, real-time analytics",
  },
  {
    title: "Data scientist",
    detail: "Probabilistic modeling, experimentation, Bayesian decision science",
  },
];

const capabilities = [
  {
    title: "Probabilistic modeling",
    copy:
      "Bayesian time series, missing-data inference, and scenario simulations, potential outcomes estimation",
  },
  {
    title: "Experiment design",
    copy:
      "Crafting trustworthy experiments using the field's most advanced algorithms",
  },
  {
    title: "Database optimization",
    copy:
      "Modeling the analytics semantic layer in on-prem and cloud infrastructure",
  },
  {
    title: "Data engineering",
    copy:
      "Streaming and batch pipelines and transformation layers that make real-time analysis work.",
  },
];

const values = [
  {
    title: "Full-stack or Bust",
    description:
      "I stay close to the entire data surface area— from schema design to final narrative— so insights stay traceable.",
  },
  {
    title: "Decision Clarity",
    description:
      "I provide not just insights but mental models that define your data-driven culture",
  },
  {
    title: "Always a Better Way",
    description:
      "I work towards improving current operations and processes to make life better for developers and end-users",
  },
];

const nowMoments = [
  "Building full-stack analytics stacks for rebar manufactures across the US",
  "Writing about Bayesian operations for real-time products",
  "Providing mentorship to young developers shrouded in the uncertain times of AI",
];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const HeroVenn = () => (
  <div className="relative mx-auto mt-6 h-64 w-full max-w-md">
    <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="vennA" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#dfe9e3" />
          <stop offset="100%" stopColor="#b9d4c5" />
        </linearGradient>
        <linearGradient id="vennB" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f2c6a0" />
          <stop offset="100%" stopColor="#f8b18d" />
        </linearGradient>
        <linearGradient id="vennC" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#c8dae2" />
          <stop offset="100%" stopColor="#b0c7d4" />
        </linearGradient>
      </defs>
      <g opacity="0.85">
        <circle cx="120" cy="110" r="90" fill="url(#vennA)" />
        <circle cx="200" cy="110" r="90" fill="url(#vennB)" />
        <circle cx="160" cy="160" r="90" fill="url(#vennC)" />
      </g>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
      <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
        Sweet spot
      </p>
      <p className="font-display text-2xl text-[#1f403c]">Full-stack analytics</p>
    </div>
    <span className="absolute left-2 top-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
      Backend development
    </span>
    <span className="absolute right-3 top-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
      Data science
    </span>
    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
      Data engineering
    </span>
  </div>
);

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 3);

  return (
    <main className="relative isolate overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-[-200px] z-0 mx-auto h-[420px] max-w-4xl rounded-full bg-gradient-to-br from-[#dfe9e3] via-[#f4ede4] to-[#f2c6a0] opacity-80 blur-3xl gentle-float" />
      <div className="pointer-events-none absolute bottom-10 right-[-120px] h-64 w-64 rounded-full bg-gradient-to-tr from-[#c2d5ce] to-[#f0c5a8] opacity-60 blur-3xl" />

      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pt-24 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_0.8fr)] md:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
            Hej, I'm Mason
          </p>
          <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl md:text-6xl">
            Full-stack analytics for calm, real-time decision making.
          </h1>
          <p className="text-lg text-slate-700">
            I build end-to-end data products—pipelines, probabilistic models, APIs, and the
            narratives that go with them. My background spans backend development, data
            engineering, and data science, so nothing gets lost between layers.
          </p>
          <div className="flex flex-wrap gap-3">
            {coreRoles.map((role) => (
              <div key={role.title} className="hyggeligt-panel px-4 py-3 text-sm">
                <p className="font-semibold text-[#1f403c]">{role.title}</p>
                <p className="text-xs text-slate-500">{role.detail}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/writings"
              className="inline-flex items-center rounded-full bg-[#26443b] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1f3731]"
            >
              Browse writings
            </Link>
            <a
              href="mailto:masonjveilleux@gmail.com"
              className="inline-flex items-center rounded-full border border-[#1f403c] px-6 py-3 text-sm font-semibold text-[#1f403c] transition duration-300 hover:-translate-y-0.5 hover:bg-white/70"
            >
              Start a project with me
            </a>
          </div>
        </div>

        <div className="hyggeligt-panel p-8 text-sm text-slate-600">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">About</p>
          <p className="mt-4 text-base text-slate-700">
            I am a data scientist-engineer, delivering full-stack analytics support in the manufacturing industry.
            I currently, live in Alaska with my family. I enjoy cooking and hiking with my wife and (now) two year-old.
          </p>
          <ul className="mt-6 space-y-3">
            {nowMoments.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[#26443b]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Skill blend
            </p>
            <HeroVenn />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-6xl px-6" id="approach">
        <div className="hyggeligt-panel px-8 py-12">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
            Capabilities
          </p>
          <h2 className="mt-4 font-display text-4xl text-slate-900">
            Full-stack analytics in practice.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {capabilities.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-inner shadow-white/20 transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <h3 className="text-xl font-semibold text-[#1f403c]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="relative z-10 mx-auto mt-24 max-w-6xl px-6" id="projects"> */}
      {/*   <div className="flex flex-col gap-8 lg:flex-row lg:items-center"> */}
      {/*     <div className="hyggeligt-panel p-8 lg:w-1/3"> */}
      {/*       <p className="text-sm uppercase tracking-[0.4em] text-slate-500"> */}
      {/*         Previous projects */}
      {/*       </p> */}
      {/*       <h2 className="mt-3 font-display text-3xl text-slate-900"> */}
      {/*         Three builds I keep referencing. */}
      {/*       </h2> */}
      {/*       <p className="mt-4 text-sm text-slate-600"> */}
      {/*         Dive into detailed build logs that connect backend engineering, data */}
      {/*         pipelines, and probabilistic reasoning—each story links to the full */}
      {/*         write-up. */}
      {/*       </p> */}
      {/*     </div> */}
      {/*     <div className="space-y-6 lg:w-2/3"> */}
      {/*       {flagshipProjects.map((project) => ( */}
      {/*         <Link */}
      {/*           key={project.title} */}
      {/*           href={`/posts/${project.slug}`} */}
      {/*           className="block" */}
      {/*         > */}
      {/*           <article className="hyggeligt-panel p-6 transition duration-300 hover:-translate-y-1"> */}
      {/*             <h3 className="text-2xl font-semibold text-[#1f403c]"> */}
      {/*               {project.title} */}
      {/*             </h3> */}
      {/*             <p className="mt-2 text-sm text-slate-600">{project.summary}</p> */}
      {/*             <ul className="mt-3 list-disc pl-5 text-sm text-slate-600"> */}
      {/*               {project.highlights.map((highlight: string) => ( */}
      {/*                 <li key={highlight}>{highlight}</li> */}
      {/*               ))} */}
      {/*             </ul> */}
      {/*             <span className="mt-4 inline-block text-sm font-semibold text-[#1f403c]"> */}
      {/*               Read build log -&gt; */}
      {/*             </span> */}
      {/*           </article> */}
      {/*         </Link> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </section> */}
      {/**/}
      <section
        id="values"
        className="relative z-10 mx-auto mt-24 max-w-6xl px-6"
      >
        <div className="grid gap-10 md:grid-cols-[0.8fr,1.2fr]">
          <div className="hyggeligt-panel p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
              About
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              How I like to work with teams.
            </h2>
            <p className="mt-4 text-sm text-slate-600">
              My work pairs backend craftsmanship with probabilistic modeling, so every
              metric or model is grounded in well-behaved data. I’m happiest when we can
              whiteboard, write, and ship products that make decision-making under uncertainty clearer.
            </p>
          </div>
          <div className="space-y-6">
            {values.map((value, index) => (
              <article
                key={value.title}
                className="hyggeligt-panel p-6 fade-slide"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <h3 className="text-2xl font-semibold text-[#1f403c]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section
          id="writing"
          className="relative z-10 mx-auto mt-24 max-w-6xl px-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
                Writing
              </p>
              <h2 className="mt-3 font-display text-4xl text-slate-900">
                Field notes
              </h2>
            </div>
            <Link
              href="/writings"
              className="text-sm font-semibold text-[#1f403c] underline-offset-4 hover:underline"
            >
              View all writings
            </Link>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="hyggeligt-panel flex flex-col p-6 transition duration-300 hover:-translate-y-2"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {formatDate(post.date)}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-[#1f403c]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        id="contact"
        className="relative z-10 mx-auto mt-24 max-w-4xl px-6"
      >
        <div className="hyggeligt-panel px-8 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
            Let’s work together
          </p>
          <h2 className="mt-4 font-display text-4xl text-slate-900">
            If your team needs a unique mix of backend rigor and probabilistic modeling, I’d love to hear from you.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
            Send a note with the decision you’re trying to improve, or ask me to sketch a
            roadmap for a full-stack analytics revamp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:masonjveilleux@gmail.com"
              className="inline-flex items-center rounded-full bg-[#26443b] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition duration-300 hover:-translate-y-0.5"
            >
              Email Mason
            </a>
            <a
              href="https://www.linkedin.com/in/masonveilleux"
              className="inline-flex items-center rounded-full border border-[#1f403c] px-8 py-3 text-sm font-semibold text-[#1f403c] transition duration-300 hover:-translate-y-0.5 hover:bg-white/70"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
