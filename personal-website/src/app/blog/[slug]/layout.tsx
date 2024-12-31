// src/app/blog/[slug]/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { BlogPosts } from '../BlogSummary';
import TopNav from '@/components/TopNav'; // Your existing TopNav component

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogPostLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen">
      <TopNav /> {/* Your existing navigation */}
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {children}
          
          {/* Other blog posts navigation */}
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Other Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BlogPosts.slice(0, 4).map((post) => (
                <Link 
                  key={post.link}
                  href={post.link}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h4 className="font-medium">{post.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}