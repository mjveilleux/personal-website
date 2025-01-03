
// app/blog/[slug]/layout.tsx
import { BlogPosts } from '../BlogSummary';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen m-0 p-0">
      {/* Main content - no margins or padding */}
      <main className="flex-1 m-0 p-0">
        {children}
      </main>

      {/* Sidebar - absolute positioning on the right */}
      <aside className="w-48 bg-white shadow-lg h-screen overflow-y-auto border-l">
        <div className="p-3">
          <h2 className="text-lg font-semibold mb-3">My Other Posts</h2>
          <nav className="space-y-1">
            {BlogPosts.map((post) => (
              <a
                key={post.title}
                href={post.link}
                className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-1.5 rounded transition-colors duration-150"
              >
                {post.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}