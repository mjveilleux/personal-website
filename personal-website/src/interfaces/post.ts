import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: Author;
  excerpt: string;
  content: string;
  preview?: boolean;
  tags?: string[];
};
