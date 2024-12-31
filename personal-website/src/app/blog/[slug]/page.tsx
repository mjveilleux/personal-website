// src/app/blog/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import { BlogPosts } from '../BlogSummary';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return BlogPosts.map((post) => ({
    slug: post.link.replace('.html', '').replace('/', '')
  }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = params;
  
  // Read the HTML content
  const htmlPath = path.join(process.cwd(), 'public', `${slug}.html`);
  const content = await fs.readFile(htmlPath, 'utf-8');

  return (
    <article className="prose prose-lg mx-auto">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}