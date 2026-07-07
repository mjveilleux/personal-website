# personal-website

Mason's personal website and blog, built with Next.js, Markdown, and TypeScript.

Blog posts live in `/_posts` as Markdown files with front matter. Adding a new `.md` file there creates a new post.

## Running locally

**Prerequisites:** Node.js (v18+) and npm

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
npm run build   # Production build
npm run start   # Start the production server (after build)
```

## Writing a post

Create a new `.md` file in `/_posts` with the following front matter:

```markdown
---
title: "Post title"
excerpt: "Short description"
coverImage: "/assets/blog/your-post/cover.jpg"
date: "2026-01-01"
author:
  name: Mason Veilleux
  picture: "/assets/blog/authors/mason.jpeg"
ogImage:
  url: "/assets/blog/your-post/cover.jpg"
---

Post content here...
```

## Stack

- [Next.js](https://nextjs.org) with Turbopack
- [Tailwind CSS](https://tailwindcss.com) v3
- [remark](https://github.com/remarkjs/remark) + [rehype](https://github.com/rehypejs/rehype) for Markdown processing
- [KaTeX](https://katex.org) for math rendering
- [Vercel Analytics](https://vercel.com/analytics)
