type Project = {
  name: string
  description: string
  link: string
  video: string
  thubmnail: string
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
    thubmnail: 'https://i.imgur.com/etkXhS0.png',
    video: 'https://www.youtube.com/watch?v=9PQ99JlaG0g',
    id: 'project1',
  },
  {
    name: 'Content Hub',
    description: 'Automates social media content creation for platforms like Twitter, Instagram, LinkedIn, and YouTube.',
    link: 'https://devpost.com/software/content-hub',
    thubmnail: 'https://i.imgur.com/eIo4ZBC.png',
    video: 'https://www.youtube.com/watch?v=dtiK1DM_53M&t=41s&ab_channel=YashwanthPavushetty',
    id: 'project2',
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
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
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
type Hackathon = {
  name: string
  date: string
  result: string
  link: string
  thumbnail: string
  description: string
  id: string
}

export const HACKATHONS: Hackathon[] = [

  {
    name: 'Hypermode Knowledge Graph + AI Challenge',
    date: 'Jan 2025',
    result: 'Winner (3000$ cash prize)',
    thumbnail : 'https://i.imgur.com/6OkzN1M.png',
    link: 'https://devpost.com/software/dev-docs',
    description: 'Designed an AI-powered tool that streamlines developer workflows by providing real-time, accurate answers from  company documentation',
    id: 'hack1',
  },
  {
    name: 'NASA Space Apps Challenge 2024',
    date: 'Agust 2024',
    result: 'People Choice Award Winner',
    link: 'https://www.spaceappschallenge.org/',
    thumbnail : 'https://i.imgur.com/q2GYo6s.png',
    description: 'Developed an AI-powered platform inspired by the James Webb Space Telescope to create personalized space exploration videos.',
    id: 'hack2',
  },

  {
    name: 'Smart India Hackathon (SIH 2023 finale)',
    date: 'Dec 2023',
    result: '2nd Place',
    thumbnail : 'https://media.licdn.com/dms/image/v2/D562DAQH03FKX4f3wYw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1720616958782?e=1739631600&v=beta&t=36PuE-rzMnTx-cF9ZUwoUhL5UrP8hOWERTeULrKy6nw',
    link: 'https://www.linkedin.com/in/pyashwanthkrishna/details/projects/',
    description: 'Developed an automated drill core rock sample lithology logging system using YOLO algorithm.',
    id: 'hack3',
  },
];