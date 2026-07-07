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
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10 sm:pt-14">
      <Link href="/" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors">
        ← Mason Veilleux
      </Link>
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Writings</p>
        <h1 className="mt-3 font-display text-2xl sm:text-4xl text-slate-900">
          Dispatches from head banging.
        </h1>
      </div>


<section className="mt-10 space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-black/[0.03]"
          >
            <div className="flex items-baseline gap-2">
              <h2 className="font-medium text-[#1f403c] text-[15px] group-hover:underline underline-offset-4">
                {post.title}
              </h2>
              <span className="flex-1 border-b border-dotted border-slate-200" aria-hidden />
              <p className="shrink-0 tabular-nums text-[12px] text-slate-400">{formatDate(post.date)}</p>
            </div>
            <p className="mt-1 text-[13px] text-slate-500">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
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
