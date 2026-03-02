import Link from "next/link";
import { flagshipProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects | Mason Veilleux",
  description:
    "Selected full-stack analytics projects spanning backend development, data engineering, and probabilistic modeling.",
};

export default function ProjectsPage() {
  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-20">
      <section className="hyggeligt-panel px-8 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Projects</p>
        <h1 className="mt-4 font-display text-5xl text-slate-900">
          Full-stack analytics in the wild.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
          Every project pairs backend craftsmanship, reliable data pipelines, and
          probabilistic models so decisions arrive with confidence intervals.
          Below are a few favorites.
        </p>
      </section>

      <section className="mt-16 space-y-8">
        {flagshipProjects.map((project, index) => (
          <Link
            key={project.title}
            href={`/posts/${project.slug}`}
            className="block fade-slide"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <article className="hyggeligt-panel px-6 py-6 transition duration-300 hover:-translate-y-1">
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl text-[#1f403c]">
                  {project.title}
                </h2>
                <p className="text-sm text-slate-600">{project.summary}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#26443b]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-4 text-sm font-semibold text-[#1f403c]">
                  Read build log -&gt;
                </span>
              </div>
            </article>
          </Link>
        ))}
      </section>

      <section className="mt-16 text-center">
        <p className="text-base text-slate-600">
          Want to explore a similar build? Email
          <a
            href="mailto:masonjveilleux@gmail.com"
            className="ml-2 font-semibold text-[#1f403c] underline-offset-4 hover:underline"
          >
            masonjveilleux@gmail.com
          </a>
          and share the decision you’re trying to accelerate.
        </p>
      </section>
    </main>
  );
}
