
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
    </div>
  );
}