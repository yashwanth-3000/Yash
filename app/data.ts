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
  /** Optional date/result for hackathons or competitions. */
  date?: string
  result?: string
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
    name: 'Text2Story',
    description: 'AI-driven platform that transforms textbook lessons into interactive, animated videos, enhancing childrens education.',
    link: '',
    video: 'https://www.youtube.com/watch?v=9PQ99JlaG0g',
    thumbnail: 'https://i.imgur.com/etkXhS0.png',
    tags: ['GenAI', 'Education', 'Video'],
    id: 'project1',
  },
  {
    name: 'Content Hub',
    description: 'Automates social media content creation for platforms like Twitter, Instagram, LinkedIn, and YouTube.',
    link: 'https://devpost.com/software/content-hub',
    video: 'https://www.youtube.com/watch?v=dtiK1DM_53M&t=41s&ab_channel=YashwanthPavushetty',
    thumbnail: 'https://i.imgur.com/eIo4ZBC.png',
    tags: ['GenAI', 'Content', 'Automation'],
    id: 'project2',
  },
  {
    name: 'AI Merchant Studio & Storefront',
    date: 'Jan 2026',
    result: 'Best Design Winner',
    thumbnail: '/cover.jpg',
    link: 'https://lablab.ai/ai-hackathons/agentic-commerce-on-arc/commerce-studio/ai-merchant-studio-and-storefront',
    description:
      'USDC payments unlock AI-generated product images + video. On-chain verification gates generation and products auto-publish to a consumer storefront.',
    tags: ['GenAI', 'Replicate', 'Web3','Arc','Circle'],
    id: 'project-arc',
  },
  {
    name: 'Kisan',
    date: 'Nov 2025',
    result: '  ',
    thumbnail: 'https://i.ibb.co/v4Vj2ppw/imgggkisan.jpg',
    link: 'https://devpost.com/software/kissan-p5h81u',
    description:
      'Built Kisan, an AI-powered multi-agent platform that helps farmers with crop advice, disease detection, weather insights, and government scheme guidance.',
    tags: ['GenAI', 'Multi-agent', 'GCP'],
    featured: true,
    id: 'project-kisan',
  },
  {
    name: 'Adobe Express Hackathon',
    date: 'June 2025',
    result: 'Adobe Funded',
    thumbnail: 'https://i.ibb.co/DgHjM2Ff/1.png',
    link: 'https://adobesparkpost.app.link/TR9Mb7TXFLb?mode=private&claimCode=w909m3820:RJ93PPBW',
    description:
      "Built Img Crafter, an AI-powered Adobe Express add-on with Generate, Edit, and Mimic features. Didn't win but Adobe funded our project to completion.",
    tags: ['GenAI', 'Image', 'Adobe'],
    id: 'project-img-crafter',
  },
  {
    name: 'Dev Docs',
    date: 'Jan 2025',
    result: 'Winner (3000$ cash prize)',
    thumbnail: 'https://i.imgur.com/6OkzN1M.png',
    link: 'https://devpost.com/software/dev-docs',
    description:
      'Designed an AI-powered tool that streamlines developer workflows by providing real-time, accurate answers from company documentation',
    tags: ['RAG', 'Knowledge Graph', 'GenAI'],
    featured: true,
    id: 'project-dev-docs',
  },
  {
    name: 'NASA Space Apps Challenge 2024',
    date: 'Agust 2024',
    result: 'People Choice Award Winner',
    link: 'https://www.spaceappschallenge.org/',
    thumbnail: 'https://i.imgur.com/q2GYo6s.png',
    description:
      'Developed an AI-powered platform inspired by the James Webb Space Telescope to create personalized space exploration videos.',
    tags: ['GenAI', 'Video', 'Personalization'],
    id: 'project-nasa',
  },
  {
    name: 'Smart India Hackathon (SIH 2023 finale)',
    date: 'Dec 2023',
    result: '2nd Place',
    thumbnail:
      'https://media.licdn.com/dms/image/v2/D562DAQH03FKX4f3wYw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1720616958782?e=1739631600&v=beta&t=36PuE-rzMnTx-cF9ZUwoUhL5UrP8hOWERTeULrKy6nw',
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