import Link from "next/link";
import { getAllPosts } from "@/lib/api";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export const metadata = {
  title: "Writings | Mason Veilleux",
  description:
    "Field notes from the top of mind. Usually related to statistics or backend development",
};

export default function WritingsPage() {
  const posts = getAllPosts().sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );

  const tags = Array.from(
    new Set(posts.flatMap((post) => post.tags ?? [])),
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16">
      <div className="hyggeligt-panel px-8 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Writings</p>
        <h1 className="mt-4 font-display text-5xl text-slate-900">
          Dispatches from head banging.
        </h1>
      </div>

      {tags.length > 0 && (
        <section className="mt-12">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Tag index
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1f403c] shadow-inner"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="hyggeligt-panel flex flex-col gap-3 px-6 py-5 transition duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-slate-900">
                {post.title}
              </h2>
              <p className="text-sm text-slate-500">{formatDate(post.date)}</p>
            </div>
            <p className="text-sm text-slate-600">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d9cec0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f403c]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </section>
    </main>
  );
}
