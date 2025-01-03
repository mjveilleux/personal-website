// app/blog/[slug]/page.tsx
interface PageProps {
    params: Promise<{
      slug: string;
    }>;
  }
  
  export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    
    return (
      <div className="w-full h-screen">
        <iframe
          src={`/blogs/${slug}.html`}
          className="w-full h-full border-none"
          title="Blog post content"
          style={{
            minHeight: '100vh',
            width: '100%',
            margin: 0,
            padding: 0,
            border: 'none'
          }}
        />
      </div>
    );
  }