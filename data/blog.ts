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
    slug: 'starting-a-3d-printing-project',
    title: 'Starting a 3D printing project: from idea to first print',
    excerpt: 'I am starting a small 3D printing project to turn digital ideas into desk toys, decorative objects, and abstract designs that are interesting to look at and satisfying to hold.',
    category: 'Behind the Build',
    publishedAt: '2026-09-02',
    readingTime: '6 min read',
    featured: true,
    sections: [
      {
        heading: 'What I want to make',
        paragraphs: [
          'The idea is simple: design small objects that can live on a desk or tabletop. Some may be playful toys, while others may be abstract shapes, geometric studies, or objects inspired by technology and everyday mechanisms. I want them to look intentional from different angles, not just from the view shown in a render.',
          'This will be an experiment in moving between digital design and physical form. A model that looks good on a screen still has to print reliably, stand on its own, feel comfortable to handle, and make sense at its intended scale.',
        ],
      },
      {
        heading: 'Hardware I need to get started',
        paragraphs: [
          'The core setup is a 3D printer, filament, a computer, and a way to move the finished print from the computer to the printer. For a first project, a dependable FDM printer is a practical starting point because it uses affordable thermoplastic filament and is well suited to small prototypes and decorative pieces.',
          'I will also need PLA filament, a level and stable surface, spare nozzles, a scraper or removal tool, flush cutters, and basic cleaning supplies. Safety matters too: the printer needs ventilation, supervision while learning, and enough space around hot and moving parts. I will follow the manufacturer instructions rather than treating the printer like an unattended appliance.',
        ],
      },
      {
        heading: 'Software from sketch to printable file',
        paragraphs: [
          'The workflow begins with a modeling tool. Blender is a strong option for organic shapes, abstract designs, and sculptural forms. A CAD tool such as FreeCAD or Fusion can be better for precise dimensions, repeated parts, and mechanical features. I can use either approach depending on the object instead of forcing every idea into one tool.',
          'The finished model is exported as an STL or 3MF file and opened in a slicer such as PrusaSlicer, OrcaSlicer, or Cura. The slicer converts the model into printer instructions, called G-code. This is where I choose layer height, infill, wall thickness, supports, print speed, and temperature. The slicer preview is important because it can reveal floating geometry, unsupported overhangs, thin walls, or a print that will take far longer than expected.',
        ],
      },
      {
        heading: 'My first-print workflow',
        paragraphs: [
          'I plan to start with a small, uncomplicated object rather than a large showcase piece. First I will sketch a few silhouettes, choose one that can sit securely on a desk, and build a simple watertight model. Before printing the complete design, I can print a small section or low-detail version to check scale, balance, and surface quality.',
          'After preparing the printer, I will load PLA, confirm the build plate is clean and level, slice the model, and inspect the preview layer by layer. During the first print I will watch the initial layers closely because poor adhesion can ruin the rest of the job. Once it finishes and cools, I will remove it carefully, clean up small supports or strings, and record what I would change in the next version.',
        ],
      },
      {
        heading: 'What I will learn from each version',
        paragraphs: [
          'The most useful part of this project will probably be the iteration. I want to compare model changes with physical results: how a thicker base affects stability, how a sharper angle changes supports, and how scale affects the way a form reads on a desk. I will keep notes and photographs so the project becomes a record of decisions rather than just a collection of finished objects.',
          'This is a starting point, not a final plan. Future updates can cover the printer I choose, the first successful print, failed attempts, filament tests, finishing techniques, and the designs that are worth making again. For now, the goal is to get from an idea on a screen to one real object I can place on a table.',
        ],
      },
    ],
    takeaways: ['Start with a small, stable design', 'Use a slicer preview before printing', 'Record each version and what changed', 'Treat heat, motion, and ventilation seriously'],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}