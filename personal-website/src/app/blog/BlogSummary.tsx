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
      title: "Part 1: Optimizing Construction Bidding Strategy",
      description: "An overview of bidding models and why they are useful",
      link: "/blog/2025-01-08-part-1-optimizing-bids",
      type: "blog",
      tags: ["auction theory", "revenue optimization", "construction"],
      featured: 'true',
      image: "/favicon.ico"
    },
    {
      title: "Getting Quarto Started in NextJS",
      description: "How do you get your Quarto doc to work in NextJS, I found an answer!",
      link: "/blog/2025-01-02-quarto-in-next-js",
      type: "blog",
      tags: ["nextjs", "web dev", "quarto"],
      featured: 'true',
      image: "/favicon.ico"
    },
    {
      title: "Predicting Hospital Readmissions",
      description: "(EXTERNAL LINK) My DataCamp competition submission",
      link: "https://www.datacamp.com/competitions/how-can-hospitals-reduce-readmissions",
      type: "blog",
      tags: ["r", "shiny", "healthcare", "statistics"],
      featured: 'true',
      image: "/datacamp-comp.png"
    },
    // {
    //   title: "Getting Started With Economics: A Guide for the Econ Curious",
    //   description: "I want to tell everyone about how amazing the field of economics and econometrics is. This is a little guide I made for someone starting an undergraduate degree and are curious about majoring in Economics.",
    //   link: "mailto:masonjveilleux@gmail.com",
    //   type: "project",
    //   tags: ["economics", "education", "guide"],
    //   featured: 'false',
    //   image: "/favicon.ico",
    //   linkType: "email"
    // }
  ];