export interface BlogPost {
    title: string;
    description: string;
    link: string;
    type: 'blog' | 'project';
    tags: string[];
    featured: string ;
    image: string;
    linkType?: 'email' | 'github' | 'external';
  }
  
  export const BlogPosts: BlogPost[] = [
    {
      title: "Multi-Collinearity is Weird",
      description: "I write about how increasing the correlation between two explantory variables skews your linear in the most unexpected ways.",
      link: "#",
      type: "blog",
      tags: ["econometrics", "statistics", "linear-regression"],
      featured: 'true',
      image: "/econ_icon2.png"
    },
    {
      title: "Predicting Hospital Readmissions",
      description: "My DataCamp competition submission",
      link: "#",
      type: "blog",
      tags: ["r", "shiny", "healthcare", "machine-learning"],
      featured: 'true',
      image: "/econ_icon2.png"
    },
    {
      title: "Using RSelenium with Docker",
      description: "A web-scraper in Docker because Docker is beautiful.",
      link: "https://github.com/yourusername/rselenium-docker",
      type: "project",
      tags: ["docker", "r", "web-scraping"],
      featured: 'true',
      image: "/econ_icon2.png",
      linkType: "github"
    },
    {
      title: "Getting Started With Economics: A Guide for the Econ Curious",
      description: "I want to tell everyone about how amazing the field of economics and econometrics is. This is a little guide I made for someone starting an undergraduate degree and are curious about majoring in Economics.",
      link: "mailto:masonjveilleux@gmail.com",
      type: "project",
      tags: ["economics", "education", "guide"],
      featured: 'false',
      image: "/econ_icon2.png",
      linkType: "email"
    }
  ];