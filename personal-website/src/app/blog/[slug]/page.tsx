// app/blog/[slug]/page.tsx

interface PageProps {
    params: {
      slug: string;
    }
  }
  
  export default function BlogPost({ params }: PageProps) {
    return (
      <div className="w-full h-screen">
        <iframe
          src={`/blogs/${params.slug}.html`}
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