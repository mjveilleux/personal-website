import Link from "next/link";
import { getAllPosts } from "@/lib/api";

const workExperience = [
  {
    role: "Senior Data Engineer",
    company: "ConstructionSoftware.al",
    type: "Full-time",
    location: "Ohio, United States · Remote",
  },
  {
    role: "Data Engineer",
    company: "GDP Game Data Pros, Inc. (GDP)",
    type: "Full-time",
    location: "San Francisco Bay Area · Remote",
  },
  {
    role: "Analytics Engineer",
    company: "Alaska Native Tribal Health Consortium (ANTHC)",
    type: "Full-time",
    location: "Anchorage, Alaska, United States",
  },
  {
    role: "Economist",
    company: "State of Alaska",
    type: "Full-time",
    location: "Anchorage, Alaska, United States",
  },
  {
    role: "Graduate Research Assistant",
    company: "University of Kent",
    type: "Part-time",
    location: "Kent, England, United Kingdom",
  },
];

const recentProjects = [
  {
    title: "Gameplan Science",
    slug: "https://gameplan-science.com/",
    description:
      "Bayesian team-strength estimation for sports analytics. Recovers latent offense and defense parameters by season-week and returns posterior predictive distributions for game outcomes.",
  },
  {
    title: "bid.optimizer",
    slug: "https://www.bid-optimizer.com/",
    description:
      "Combines auction theory with Bayesian decision science so construction estimators can price bids at the profit-maximizing level in minutes rather than days.",
  },
];

const inspiredBy = [
  {
    title: "Observational Price Variation in Scanner Data Does Not Reproduce Experimental Price Elasticities",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4899765",
    note: "Observational causal inference falls short of experimentation — this is why you need experimentation.",
  },
  {
    title: "The Soul of Erlang and Elixir",
    url: "https://www.youtube.com/watch?v=JvBT4XBdoUE",
    note: "Perfectly captures how resilient systems interface with a functional language.",
  },
  {
    title: "You Can Just Do Things",
    url: "https://www.youtube.com/watch?v=X7HFU786NiQ",
    note: "The ending of a Neovim tutorial that hooked me into making Neovim my daily driver. You get to decide how your daily software tools look, you can have fun building them, and you can make them work best for you. I try to instill this mantra daily.",
  },
];

export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <main className="mx-auto max-w-2xl px-6 pb-32 pt-14 sm:pt-20">

      <header className="mb-10">
        <h1 className="text-xl font-bold text-[#1a1f25]">Mason Veilleux</h1>
        <p className="mt-1.5 text-slate-500">Building Machine Learning and AI pipelines</p>
        <div className="mt-3 flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com/mjveilleux"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-slate-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/mason-veilleux"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-slate-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="mailto:masonjveilleux@gmail.com"
            aria-label="Email"
            className="transition-colors hover:text-slate-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </header>

      {/* Intro */}
{/* I design and build tools for data analysis, deep work, and decision-making. I care most about ones that enable flow, creativity, and a clearer understanding of the world. */}
{/* I'm most excited about how AI can be used by humans to do increasingly ambitious feats. The diagram above, Koestler's by way of Alan Kay, frames a crossroads during a major technological advance: you can automate the old or leverage the new. I seek work that enables me to leverage the new. Where will this new technology take us? */}

      <p className="text-base leading-relaxed text-slate-800 sm:text-[15px]">
        <strong>I design and build machine learning and AI
        pipelines for optimizing decisions under uncertainty.</strong> I care most about ones that are transparent, trustworthy, and give decision-makers the confidence they need.    </p>

{/*  some cool svg here */}


      <p className="text-base leading-relaxed text-slate-800 sm:text-[15px]">
        <strong>I am most excited about</strong> building and deploying statistical models to optimize decision-making alongside fostering a culture of trust and empowerment with data.</p>


      {/* Selected Work */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <div className="mb-5 flex items-baseline gap-3">
          <p className="whitespace-nowrap text-[13px] font-semibold text-slate-400">
            Selected work
          </p>
          <span className="flex-1 border-b border-dotted border-slate-300" aria-hidden />
        </div>
        <div className="space-y-5">
          {workExperience.map((job) => (
            <div key={`${job.role}-${job.company}`} className="rounded-md px-2 py-1 -mx-2">
              <span className="font-medium text-[#1f403c] text-[13px]">{job.role}</span>
              <div className="mt-0.5 text-[12px] text-slate-500">
                {job.company} · {job.type}
              </div>
              <p className="text-[12px] text-slate-400">{job.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <div className="mb-5 flex items-baseline gap-3">
          <p className="whitespace-nowrap text-[13px] font-semibold text-slate-400">
            Recent projects
          </p>
          <span className="flex-1 border-b border-dotted border-slate-300" aria-hidden />
        </div>
        <div className="space-y-7">
          {recentProjects.map((item) => (
            <a
              key={item.title}
              href={item.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-black/[0.03]"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-[#1f403c] group-hover:underline underline-offset-4">
                  {item.title}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Things that inspire me */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <div className="mb-5 flex items-baseline gap-3">
          <p className="whitespace-nowrap text-[13px] font-semibold text-slate-400">
            Things that inspire me
          </p>
          <span className="flex-1 border-b border-dotted border-slate-300" aria-hidden />
        </div>
        <ul className="space-y-4">
          {inspiredBy.map((item) => (
            <li key={item.title} className="flex gap-3 text-[13px]">
              <span className="mt-1 shrink-0 text-slate-300">—</span>
              <div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1f403c] underline-offset-4 hover:underline"
                >
                  {item.title}
                </a>
                <p className="mt-1 text-slate-500">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent writing */}
      {recentPosts.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-5 flex items-baseline gap-3">
            <p className="whitespace-nowrap text-[13px] font-semibold text-slate-400">
              Recent writing
            </p>
            <span className="flex-1 border-b border-dotted border-slate-300" aria-hidden />
          </div>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex items-baseline gap-2 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-black/[0.03]"
                >
                  <span className="font-medium text-[#1f403c] group-hover:underline underline-offset-4 text-[13px]">
                    {post.title}
                  </span>
                </Link>
                <p className="mt-0.5 px-2 text-[13px] text-slate-500">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer links */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <p className="text-[13px] leading-relaxed text-slate-500">
          You can find more in my{" "}
          <Link
            href="/projects"
            className="font-medium text-[#1f403c] underline-offset-4 hover:underline"
          >
            projects
          </Link>{" "}
          and occasional{" "}
          <Link
            href="/writings"
            className="font-medium text-[#1f403c] underline-offset-4 hover:underline"
          >
            writings
          </Link>
          . I can be reached at{" "}
          <a
            href="mailto:masonjveilleux@gmail.com"
            className="font-medium text-[#1f403c] underline-offset-4 hover:underline"
          >
            masonjveilleux@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
