export type BlogCategory = 'Engineering Notes' | 'Career' | 'Behind the Build';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  takeaways: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-software-that-feels-finished',
    title: 'Building software that feels finished',
    excerpt: 'The last ten percent of a project is where thoughtful details turn a working demo into something people trust.',
    category: 'Behind the Build',
    publishedAt: '2026-09-02',
    readingTime: '4 min read',
    featured: true,
    sections: [
      {
        heading: 'The gap between working and ready',
        paragraphs: [
          'A feature can work perfectly and still feel unfinished. The gap usually shows up in the moments around the happy path: an empty state, a slow connection, a keyboard user, or a person returning to the screen after a week away.',
          'When I build a project, I try to spend as much time on those moments as I do on the central interaction. Clear feedback, sensible defaults, and graceful failure are not polish added at the end. They are part of the feature itself.',
        ],
      },
      {
        heading: 'A practical finishing pass',
        paragraphs: [
          'My finishing pass starts with a short list: what happens before data arrives, when there is no data, when an action fails, and when the viewport is narrow? I also check the page with a keyboard and read the important content aloud. Those checks catch surprisingly different problems than a desktop mouse pass.',
          'This approach has changed how I think about portfolio projects. A project should show the underlying engineering, but it should also communicate care. The interface is evidence of how I make decisions when requirements are incomplete.',
        ],
      },
    ],
    takeaways: ['Design the edge states early', 'Test the real interaction, not just the code path', 'Treat accessibility as product quality'],
  },
  {
    slug: 'why-i-keep-building-across-platforms',
    title: 'Why I keep building across platforms',
    excerpt: 'Web, mobile, desktop, and embedded work each sharpen a different part of the engineering craft.',
    category: 'Engineering Notes',
    publishedAt: '2026-08-18',
    readingTime: '3 min read',
    sections: [
      {
        heading: 'Different constraints, better instincts',
        paragraphs: [
          'A web application teaches you to think about reach and performance. A mobile app makes interruptions and touch targets impossible to ignore. Desktop software brings installation and offline behavior into the conversation. Embedded and automotive systems make timing and reliability feel very concrete.',
          'Working across those environments is not about collecting technology badges. It is about learning which assumptions belong to a platform and which assumptions belong to the problem.',
        ],
      },
      {
        heading: 'The common thread',
        paragraphs: [
          'The projects in this portfolio look different on the surface, but the questions underneath are similar: who is using this, what do they need to accomplish, and what can go wrong? Those questions guide the architecture more reliably than a favorite framework ever could.',
          'I keep building across platforms because the constraints keep me curious. Each new environment gives me another way to practice making software understandable, resilient, and useful.',
        ],
      },
    ],
    takeaways: ['Constraints are design input', 'Choose tools around the problem', 'Transfer principles, not assumptions'],
  },
  {
    slug: 'a-small-portfolio-is-still-a-real-product',
    title: 'A small portfolio is still a real product',
    excerpt: 'A personal site is more than a list of links. It is an opportunity to practice clarity, performance, and honest communication.',
    category: 'Career',
    publishedAt: '2026-08-05',
    readingTime: '3 min read',
    sections: [
      {
        heading: 'Showing the work behind the work',
        paragraphs: [
          'A project title and a repository link tell only part of the story. The more useful question is what changed because the project exists: which problem it solves, what tradeoffs shaped it, and what I would improve with another week.',
          'That is why I am gradually treating this site as a product of its own. It needs a clear information architecture, dependable links, responsive layouts, and content that sounds like a person rather than a template.',
        ],
      },
      {
        heading: 'A place to keep learning in public',
        paragraphs: [
          'The blog is a space for the context that does not fit neatly into a project card. I can use it to document decisions, share lessons from experiments, and give people a better sense of how I approach engineering work.',
          'I do not expect every post to be a definitive tutorial. A useful update can be a careful observation, a postmortem, or a small idea worth testing. Consistency and honesty matter more than trying to sound finished.',
        ],
      },
    ],
    takeaways: ['Context makes projects memorable', 'Personal sites deserve product thinking', 'Progress is worth documenting'],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}