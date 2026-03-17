type Project = {
  name: string
  description: string
  link: string
  thumbnail: string
  /** Optional demo video URL (YouTube or direct video). */
  video?: string
  /** Tags like "GenAI", "RAG", "Computer Vision", etc. */
  tags: string[]
  /** Highlight top projects at the top of the page. */
  featured?: boolean
  /** Display in the Live projects section. */
  live?: boolean
  /** Optional live stats shown on the project card. */
  stats?: { label: string; value: number; suffix?: string }[]
  /** Optional date/result for hackathons or competitions. */
  date?: string
  result?: string
  /** Optional link to a blog post or write-up explaining how the project was built. */
  details?: string
  /** Optional GitHub repo link shown as a GitHub icon pill. */
  repo?: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Creator Skill Generator',
    date: 'Mar 2026',
    thumbnail: 'https://img.youtube.com/vi/VQdmyS9Zhng/maxresdefault.jpg',
    video: 'https://youtu.be/VQdmyS9Zhng',
    link: 'https://github.com/yashwanth-3000/creator-skill-generator',
    description:
      'Transforms creator content (Twitter/X, YouTube, pasted text) into reusable AI skill packages compatible with Codex and Claude Code, powered by a multi-step CrewAI pipeline with FastAPI backend and Next.js frontend.',
    tags: ['GenAI', 'CrewAI', 'FastAPI', 'Claude', 'Agentic'],
    id: 'project-creator-skill-generator',
  },
  {
    name: 'Kisan',
    date: 'Nov 2025',
    thumbnail: 'https://i.ibb.co/v4Vj2ppw/imgggkisan.jpg',
    link: 'https://devpost.com/software/kissan-p5h81u',
    repo: 'https://github.com/yashwanth-3000/kisan',
    description:
      'Built Kisan, an AI-powered multi-agent platform that helps farmers with crop advice, disease detection, weather insights, and government scheme guidance.',
    tags: ['GenAI', 'Multi-agent', 'GCP'],
    id: 'project-kisan',
  },
  {
    name: 'MakeMyCv',
    date: 'Nov 2025',
    result: '3rd Place',
    thumbnail: '',
    video: 'https://youtu.be/7CJ3GqxGJ4Q',
    link: '',
    repo: 'https://github.com/yashwanth-3000/MakeMyCv',
    description:
      'AI-native CV builder that turns a developer\'s GitHub, LinkedIn, and X profiles into a polished, ATS-friendly resume compiled as a LaTeX PDF.',
    tags: ['GenAI', 'Automation', 'Opus', 'No-code Workflow'],
    id: 'project-makemycv',
  },
  {
    name: 'AI Merchant Studio & Storefront',
    date: 'Jan 2026',
    result: 'Best Design Winner',
    thumbnail: 'https://img.youtube.com/vi/JIu-IRZctgY/maxresdefault.jpg',
    video: 'https://youtu.be/JIu-IRZctgY',
    link: 'https://lablab.ai/ai-hackathons/agentic-commerce-on-arc/commerce-studio/ai-merchant-studio-and-storefront',
    repo: 'https://github.com/yashwanth-3000/arc',
    description:
      'USDC payments unlock AI-generated product images + video. On-chain verification gates generation and products auto-publish to a consumer storefront.',
    tags: ['GenAI', 'Replicate', 'Web3','Arc','Circle'],
    id: 'project-arc',
  },
  {
    name: 'Dream',
    date: 'Mar 2026',
    thumbnail: 'https://img.youtube.com/vi/zXxEFVkLJ6o/maxresdefault.jpg',
    video: 'https://youtu.be/zXxEFVkLJ6o',
    link: 'https://github.com/yashwanth-3000/dream',
    description:
      'AI-powered storytelling and learning platform for children: kid-safe chat, character creation, illustrated storybook generation, and quizzes, built on Azure AI, CrewAI, and FastAPI.',
    tags: ['GenAI', 'CrewAI', 'Azure', 'FastAPI', 'Education'],
    featured: true,
    id: 'project-dream',
  },
  {
    name: 'findr.ai',
    date: 'Oct 2025',
    thumbnail: 'https://i.ibb.co/wZDysrrC/Generate-Tab.jpg',
    video: 'https://www.youtube.com/watch?v=dxQRxcknwAw',
    link: 'https://devpost.com/software/findr-ai',
    repo: 'https://github.com/yashwanth-3000/findr--ai',
    description:
      'AI-powered technical hiring platform that analyzes resumes, verifies GitHub projects for authenticity, and delivers scored candidates with 0–100% suitability rankings.',
    tags: ['GenAI', 'Multi-agent', 'CrewAI', 'Claude'],
    id: 'project-findr-ai',
  },
  {
    name: 'Adobe Express Hackathon',
    date: 'June 2025',
    result: 'Adobe Funded',
    thumbnail: 'https://i.ibb.co/DgHjM2Ff/1.png',
    video: 'https://youtu.be/4PMIb5cyBMk',
    link: 'https://adobesparkpost.app.link/TR9Mb7TXFLb?addOnId=wln2g6036',
    description:
      "Built Img Crafter, an AI-powered Adobe Express add-on with Generate, Edit, and Mimic features. Didn't win but Adobe funded our project to completion.",
    tags: ['GenAI', 'Image', 'Adobe'],
    live: true,
    repo: 'https://github.com/yashwanth-3000/img-crafter',
    details: '/blog/img-crafter-adobe-addon',
    id: 'project-img-crafter',
  },
  {
    name: 'Dev Docs',
    date: 'Jan 2025',
    result: 'Winner ($3,000 cash prize)',
    thumbnail: 'https://i.imgur.com/6OkzN1M.png',
    link: 'https://devpost.com/software/dev-docs',
    repo: 'https://github.com/yashwanth-3000/Dev-Docs-Local',
    description:
      'Designed an AI-powered tool that streamlines developer workflows by providing real-time, accurate answers from company documentation',
    tags: ['RAG', 'Knowledge Graph', 'GenAI'],
    featured: true,
    id: 'project-dev-docs',
  },
  {
    name: 'NASA Space Apps Challenge 2024',
    date: 'August 2024',
    result: "People's Choice Award Winner",
    link: 'https://www.spaceappschallenge.org/',
    thumbnail: 'https://i.imgur.com/q2GYo6s.png',
    description:
      'Developed an AI-powered platform inspired by the James Webb Space Telescope to create personalized space exploration videos.',
    tags: ['GenAI', 'Video', 'Personalization'],
    id: 'project-nasa',
  },
  {
    name: 'Text2Story',
    description: "AI-driven platform that transforms textbook lessons into interactive, animated videos, enhancing children's education.",
    link: '',
    video: 'https://www.youtube.com/watch?v=9PQ99JlaG0g',
    thumbnail: 'https://i.imgur.com/etkXhS0.png',
    tags: ['GenAI', 'Education', 'Video'],
    id: 'project1',
  },
  {
    name: 'Smart India Hackathon (SIH 2023 finale)',
    date: 'Dec 2023',
    result: '2nd Place',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
    link: 'https://www.linkedin.com/in/pyashwanthkrishna/details/projects/',
    description:
      'Developed an automated drill core rock sample lithology logging system using YOLO algorithm.',
    tags: ['Computer Vision', 'YOLO', 'Automation'],
    id: 'project-sih',
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Restack',
    title: 'Open Source contributor',
    start: 'Dec 2024',
    end: 'Jan 2025',
    link: 'https://github.com/yashwanth-3000/examples-python',
    id: 'work1',
  },
]
///
export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Img Crafter: When Adobe Believed in Our Vision',
    description: 'We didn\'t win the hackathon but Adobe funded our project. The story of building an AI-powered add-on for Adobe Express.',
    link: '/blog/img-crafter-adobe-addon',
    uid: 'blog-3',
  },
  {
    title: 'Building Kisan - How we used Google Cloud Run to bring AI closer to farmers',
    description: 'Walkthrough of how Kisan was built on Google Cloud Run, covering architecture, deployment, and scalable AI access for farmers.',
    link: 'https://medium.com/@yashwanthkrishna169/building-kisan-how-we-used-google-cloud-run-to-bring-ai-closer-to-farmers-a1255f2cdac2',
    uid: 'blog-1',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/yashwanth-3000',
  },
  {
    label: 'Twitter',
    link: 'https://x.com/Yashwanthstwt',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/pyashwanthkrishna/',
  },

]

export const EMAIL = 'pyashwanthkrishna@gmail.com'

export const GITHUB_USERNAME = 'yashwanth-3000'
