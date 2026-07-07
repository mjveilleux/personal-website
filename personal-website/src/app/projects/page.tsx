import Link from "next/link";
import { flagshipProjects } from "@/lib/projects";


export const metadata = {
  title: "Projects | Mason Veilleux",
  description:
    "Selected full-stack analytics projects spanning backend development, data engineering, and probabilistic modeling.",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10 sm:pt-14">
      <Link href="/" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors">
        ← Mason Veilleux
      </Link>
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Projects</p>
        <h1 className="mt-3 font-display text-2xl sm:text-4xl text-slate-900">
          Full-stack analytics in the wild.
        </h1>
      </div>

      <section className="mt-10 space-y-7">
        {flagshipProjects.map((project) => (
          <Link
            key={project.title}
            href={`/posts/${project.slug}`}
            className="group block rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-black/[0.03]"
          >
            <div className="flex items-baseline gap-2">
              <h2 className="font-medium text-[#1f403c] text-[15px] group-hover:underline underline-offset-4">
                {project.title}
              </h2>
            </div>
            <p className="mt-1 text-[13px] text-slate-500">{project.summary}</p>
            <ul className="mt-2 space-y-1">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] text-slate-400">
                  <span className="shrink-0 text-slate-300">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </section>

      <p className="mt-12 text-[13px] text-slate-500">
        Want to explore a similar build?{" "}
        <a
          href="mailto:masonjveilleux@gmail.com"
          className="font-medium text-[#1f403c] underline-offset-4 hover:underline"
        >
          Email me
        </a>
        {" "}and share the problem you’re working on.
      </p>
    </main>
  );
}
