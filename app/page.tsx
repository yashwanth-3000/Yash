'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  XIcon,
  PlayCircle,
  Link as LinkIcon,
  AlignLeft,
  List,
  Calendar,
  Youtube,
  BookOpen,
} from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
import { LinkPreview } from '@/components/ui/link-preview'
import { Spotlight } from '@/components/ui/spotlight'
import { Counter } from '@/components/ui/animated-counter'
import { GlowEffect } from '@/components/ui/glow-effect'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import NextLink from 'next/link'
import Image from 'next/image'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
  GITHUB_USERNAME,
} from './data'

// Overall container variants for staggering children animations
const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }

// Smooth hover animation for cards
const HOVER_CARD = {
  whileHover: {
    y: -3,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

// Professional, subtle spring for layout reflow
const TRANSITION_LAYOUT = {
  layout: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
}

const VARIANTS_INTRO_CONTENT = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.055,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1],
    },
  },
}

const VARIANTS_INTRO_LINE = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}


function Struck({ children, strikeDelay = 0, play = false }: { children: React.ReactNode; strikeDelay?: number; play?: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 1, textDecorationColor: 'transparent' }}
      animate={play ? { opacity: 0.28, textDecorationColor: '#71717a' } : { opacity: 1, textDecorationColor: 'transparent' }}
      style={{ textDecoration: 'line-through', textDecorationThickness: '2px' }}
      transition={{ duration: 0.45, delay: play ? strikeDelay : 0, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  )
}

function Highlight({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>
}

type ProjectVideoProps = {
  src: string
  /** Optional thumbnail image URL for the project. */
  thumbnail?: string
  /** Project link — if Devpost, hover shows "See Details" instead of "Watch Demo". */
  projectLink?: string
}

type IntroView = 'story' | 'tldr' | 'timeline'

/**
 * Helper functions to detect YouTube URLs and generate embed/thumbnail URLs.
 */
function isYoutube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function isGithub(url: string): boolean {
  return url.includes('github.com')
}

function getYoutubeEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    let videoId = ''
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || ''
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url
  } catch (error) {
    return url
  }
}

function getYoutubeThumbnail(url: string): string {
  try {
    const urlObj = new URL(url)
    let videoId = ''
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || ''
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
  } catch (error) {
    return ''
  }
}

/**
 * The ProjectVideo component includes a clean hover overlay.
 * When hovering over the thumbnail, the image/video fades out and the overlay
 * (with a black background and play icon/text) remains.
 *
 * - If the project uses a YouTube video, an iframe is rendered in the modal.
 * - Otherwise, the modal displays the full-screen image.
 */
function ProjectVideo({ src, thumbnail, projectLink }: ProjectVideoProps) {
  const isYoutubeVideo = isYoutube(src)
  // Use the provided thumbnail, or derive one for YouTube if available.
  const triggerThumbnail =
    thumbnail || (isYoutubeVideo ? getYoutubeThumbnail(src) : '')
  const isDevpost = Boolean(projectLink?.includes('devpost.com'))

  const thumbnailContent = (
    <>
      {triggerThumbnail ? (
        <div className="relative aspect-video w-full">
          <Image
            src={triggerThumbnail}
            alt="Project thumbnail"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      {/* Action badge that appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          {isDevpost ? (
            <LinkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
          ) : (
            <PlayCircle className="h-5 w-5 text-zinc-900 dark:text-white" />
          )}
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {isDevpost ? 'See Details' : 'Watch Demo'}
          </span>
        </div>
      </div>
    </>
  )

  if (isDevpost && projectLink) {
    return (
      <NextLink href={projectLink} target="_blank" rel="noopener noreferrer">
        <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
          {thumbnailContent}
        </div>
      </NextLink>
    )
  }

  return (
    <MorphingDialog transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
      <MorphingDialogTrigger>
        {/* Container with smooth hover effects */}
        <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
          {thumbnailContent}
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="w-[85vw] h-[85vh]">
            {isYoutubeVideo ? (
              <iframe
                src={getYoutubeEmbedUrl(src)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : triggerThumbnail ? (
              <div className="relative w-full h-full">
                <Image
                  src={triggerThumbnail}
                  alt="Full screen preview"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <video src={src} autoPlay loop muted className="w-full h-full object-cover" />
            )}
          </div>
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 z-[100] h-fit w-fit rounded-full bg-white p-1 transition-transform duration-150 ease-in-out"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { delay: 0.3, duration: 0.1 } },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

/**
 * Project image card with smooth hover animation
 */
function ProjectImageCard({
  thumbnail,
  name,
  link,
}: {
  thumbnail: string
  name: string
  link?: string
}) {
  const hasLink = Boolean(link)
  const Wrapper = hasLink ? 'a' : 'div'
  const wrapperProps = hasLink
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Wrapper {...wrapperProps} className="block">
      <div
        className={`relative group overflow-hidden ${
          hasLink ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Image with subtle scale on hover */}
        <div className="relative aspect-video w-full">
          <Image
            src={thumbnail}
            alt={`${name} thumbnail`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover scale-105 transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
        {/* Gradient overlay that appears on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent ${
            hasLink ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />
        {/* Content that slides up on hover */}
        {hasLink ? (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center gap-2 text-white">
              <LinkIcon className="h-4 w-4" />
              <span className="text-sm font-medium">View Project</span>
            </div>
          </div>
        ) : null}
      </div>
    </Wrapper>
  )
}

function TagPills({
  tags,
  onTagClick,
  activeTag,
}: {
  tags: string[]
  onTagClick?: (tag: string) => void
  activeTag?: string | null
}) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const active = activeTag === tag
        return onTagClick ? (
          <motion.button
            key={tag}
            type="button"
            onClick={() => onTagClick(tag)}
            title={`Filter by ${tag}`}
            aria-label={`Filter projects by ${tag}`}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
              active
                ? 'cursor-pointer bg-zinc-900 text-white shadow-sm shadow-zinc-900/20 ring-1 ring-white/10 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:ring-zinc-900/10'
                : 'cursor-pointer bg-zinc-100/80 text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-900 hover:ring-1 hover:ring-violet-500/25 hover:shadow-sm hover:shadow-violet-500/10 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-700/70 dark:hover:text-zinc-100 dark:hover:ring-violet-400/20'
            }`}
          >
            {tag}
          </motion.button>
        ) : (
          <span
            key={tag}
            className="inline-flex items-center rounded-md bg-zinc-100/80 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400"
          >
            {tag}
          </span>
        )
      })}
    </div>
  )
}

export default function Personal() {
  const [introView, setIntroView] = useState<IntroView>('story')
  const [tldrActivated, setTldrActivated] = useState(false)
  const handleIntroView = (view: IntroView) => {
    setIntroView(view)
    if (view === 'tldr') setTldrActivated(true)
  }
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const resultsBarRef = useRef<HTMLDivElement | null>(null)
  const introTabs = [
    { id: 'story' as const, label: 'Story', icon: AlignLeft },
    { id: 'tldr' as const, label: 'TL;DR', icon: List },
    { id: 'timeline' as const, label: 'Timeline', icon: Calendar },
  ]
  const lp = 'font-medium underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-600 hover:decoration-zinc-700 dark:hover:decoration-zinc-300 transition-colors'
  const timelineItems: { year: string; title: string; content: React.ReactNode }[] = [
    {
      year: '10th Grade',
      title: 'Creative beginnings',
      content: <>I started helping my dad with his <LinkPreview url="https://www.youtube.com/@PavushettyYashwanth" isStatic imageSrc="https://i.ibb.co/v4Vj2ppw/imgggkisan.jpg" className={lp}>YouTube channel</LinkPreview>, mostly editing videos and thinking about how to make content clear and engaging. Over time, the channel grew to 10K subscribers and 1M views, and today it has 30K subscribers and over 10M views.</>,
    },
    {
      year: '2023',
      title: 'Curiosity about AI',
      content: 'When AI started booming everywhere, I got curious and began exploring it on my own, trying to understand how these systems actually worked.',
    },
    {
      year: 'Hackathons',
      title: 'Learning by building',
      content: <>I started participating in <LinkPreview url="https://devpost.com/yashwanth-3000" isStatic imageSrc="https://i.imgur.com/6OkzN1M.png" className={lp}>hackathons</LinkPreview>, which pushed me to learn new technologies quickly and build real projects under time pressure. Along the way, I won 1st place in two international hackathons; the Hypermode Knowledge Graph + AI Challenge for building <LinkPreview url="https://devpost.com/software/dev-docs" isStatic imageSrc="https://i.imgur.com/6OkzN1M.png" className={lp}>DevDocs</LinkPreview>, and the Generative AI Hackathon with IBM Granite for <LinkPreview url="https://devpost.com/software/content-hub" isStatic imageSrc="https://i.imgur.com/eIo4ZBC.png" className={lp}>Content Hub</LinkPreview>.</>,
    },
    {
      year: 'Apps & Projects',
      title: 'Building things I want',
      content: 'Eventually I began building my own projects and apps, mostly things I personally wished existed. Like the calendar widget app for iPhone after switching from Android.',
    },
    {
      year: 'Recognition',
      title: 'Building real tools',
      content: <>One of my projects, <LinkPreview url="https://adobesparkpost.app.link/TR9Mb7TXFLb?addOnId=wln2g6036" isStatic imageSrc="https://i.ibb.co/DgHjM2Ff/1.png" className={lp}>Img Crafter AI</LinkPreview>, an add-on for <LinkPreview url="https://www.adobe.com/express/" isStatic imageSrc="https://i.ibb.co/DgHjM2Ff/1.png" className={lp}>Adobe Express</LinkPreview>, received a grant from Adobe, which encouraged me to keep building and experimenting with creative AI tools.</>,
    },
    {
      year: 'Now',
      title: 'Builder mindset',
      content: 'These days I spend most of my time experimenting with Generative AI and building practical tools that people might actually find useful.',
    },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Pavushetty Yashwanth Krishna',
        jobTitle: 'Generative AI Developer',
        email: `mailto:${EMAIL}`,
        sameAs: SOCIAL_LINKS.map((link) => link.link),
      },
      ...PROJECTS.map((project) => ({
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        ...(project.link ? { url: project.link } : {}),
        ...(project.tags?.length
          ? { keywords: project.tags.join(', ') }
          : {}),
      })),
    ],
  }

  const filteredProjects = useMemo(() => {
    if (!selectedTag) return PROJECTS
    return PROJECTS.filter((p) => p.tags?.includes(selectedTag))
  }, [selectedTag])

  const featuredProjects = useMemo(() => {
    const onlyFeatured = filteredProjects.filter((p) => p.featured)
    // Ensure consistent order for featured section
    const order = new Map<string, number>([
      ['project-dream', 0],
      ['project-dev-docs', 1],
    ])
    return onlyFeatured.sort(
      (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
    )
  }, [filteredProjects])

  const liveProjects = useMemo(
    () => filteredProjects.filter((p) => p.live && !p.featured),
    [filteredProjects],
  )

  const otherProjects = useMemo(
    () => filteredProjects.filter((p) => !p.featured && !p.live),
    [filteredProjects],
  )

  const totalResults = filteredProjects.length

  function toggleTag(tag: string) {
    setSelectedTag((prev) => (prev === tag ? null : tag))
  }

  useEffect(() => {
    if (!selectedTag) return
    resultsBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedTag])

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <motion.main
        className="space-y-20"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        {/* Hero / Intro Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Image
                  src="https://i.imgur.com/tdHUjkg.png"
                  alt="Pavushetty Yashwanth Krishna"
                  width={52}
                  height={52}
                  className="rounded-full"
                  unoptimized
                />
              </motion.div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                  Pavushetty Yashwanth Krishna.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Generative AI Developer.
                </p>
              </div>
            </div>

            {/* Tabs pill */}
            <div
              role="tablist"
              aria-label="About me views"
              className="inline-flex w-fit items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800/80"
            >
              {introTabs.map((tab) => {
                const active = introView === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleIntroView(tab.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] font-medium transition-all duration-150 ${
                      active
                        ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative">
              {/* Story */}
              <div className={`space-y-5 text-[0.95rem] leading-[1.75] text-zinc-800 dark:text-zinc-100 sm:text-[1rem] transition-opacity duration-150 ${introView === 'story' ? 'block' : 'hidden'}`}>
                  <p>I&apos;m a Generative AI developer who likes building things that actually get used. I spend most of my time working with models, experimenting with ideas, and figuring out how to turn &ldquo;this would be cool&rdquo; into something real and reliable.</p>
                  <p>I love taking part in{' '}
                    <LinkPreview url="https://devpost.com/yashwanth-3000" isStatic imageSrc="https://i.imgur.com/6OkzN1M.png" className="font-medium underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-600 hover:decoration-zinc-700 dark:hover:decoration-zinc-300 transition-colors">hackathons</LinkPreview>.
                    {' '}They&apos;ve pushed me to switch tech stacks quickly, learn new tools on the fly, and adapt to different workflows. I think that&apos;s helped me grow a lot as a developer.</p>
                  <p>I&apos;ve always enjoyed creating things beyond just code. In 10th grade, I started helping my dad with his{' '}
                    <LinkPreview url="https://www.youtube.com/@PavushettyYashwanth" isStatic imageSrc="https://i.ibb.co/v4Vj2ppw/imgggkisan.jpg" className="font-medium underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-600 hover:decoration-zinc-700 dark:hover:decoration-zinc-300 transition-colors">YouTube channel</LinkPreview>,
                    {' '}mostly editing and thinking through content. It taught me that clarity and intention matter, whether you&apos;re making a video or building a product.</p>
                  <p>Most of the things I build start with a personal itch. When I switched from Android to iOS, I really missed the Google Calendar widget I used every day. So instead of just complaining about it, I started building my own calendar widget app, one that brings useful widgets to iPhone.</p>
                  <p>Most of the time, I build things I genuinely wish already existed.</p>
              </div>

              {/* TL;DR — stays mounted so Struck animations play once and stay */}
              <div className={`space-y-5 text-[0.95rem] leading-[1.75] text-zinc-800 dark:text-zinc-100 sm:text-[1rem] ${introView === 'tldr' ? 'block' : 'hidden'}`}>
                  <p>
                    <Highlight delay={0.0}>I&apos;m a Generative AI developer who likes building things that actually get used.</Highlight>{' '}
                    <Struck play={tldrActivated} strikeDelay={0.4}>I spend most of my time working with models, experimenting with ideas, and figuring out how to turn &ldquo;this would be cool&rdquo; into something real and reliable.</Struck>
                  </p>
                  <p>
                    <Highlight delay={0.55}>I love taking part in{' '}
                    <LinkPreview url="https://devpost.com/yashwanth-3000" isStatic imageSrc="https://i.imgur.com/6OkzN1M.png" className="font-medium underline underline-offset-2 decoration-zinc-600 hover:decoration-zinc-800 transition-colors">hackathons</LinkPreview>.</Highlight>{' '}
                    <Highlight delay={0.75}>pushed me to switch tech stacks quickly, learn new tools on the fly, and adapt to different workflows.</Highlight>{' '}
                    <Struck play={tldrActivated} strikeDelay={1.0}>I think that&apos;s helped me grow a lot as a developer.</Struck>
                  </p>
                  <p>
                    <Struck play={tldrActivated} strikeDelay={1.15}>I&apos;ve always enjoyed creating things beyond just code. In 10th grade,</Struck>{' '}
                    <Highlight delay={1.2}>started helping my dad with his{' '}
                    <LinkPreview url="https://www.youtube.com/@PavushettyYashwanth" isStatic imageSrc="https://i.ibb.co/v4Vj2ppw/imgggkisan.jpg" className="font-medium underline underline-offset-2 decoration-zinc-600 hover:decoration-zinc-800 transition-colors">YouTube channel</LinkPreview></Highlight>.{' '}
                    <Struck play={tldrActivated} strikeDelay={1.45}>mostly editing and thinking through content.</Struck>{' '}
                    <Highlight delay={1.5}>It taught me that clarity and intention matter.</Highlight>{' '}
                    <Struck play={tldrActivated} strikeDelay={1.75}>whether you&apos;re making a video or building a product.</Struck>
                  </p>
                  <p>
                    <Highlight delay={1.8}>Most of the things I build start with a personal itch.</Highlight>{' '}
                    <Struck play={tldrActivated} strikeDelay={2.0}>When I switched from Android to iOS, I really missed the Google Calendar widget I used every day. So instead of just complaining about it,</Struck>{' '}
                    <Highlight delay={2.1}>I started building my own calendar widget app, one that brings useful widgets to iPhone.</Highlight>
                  </p>
                  <p><Highlight delay={2.4}>Most of the time, I build things I genuinely wish already existed.</Highlight></p>
              </div>

              {/* Timeline */}
              {introView === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={VARIANTS_INTRO_CONTENT}
                  className="mt-3 max-w-[84ch]"
                >
                  <div className="relative">
                    {/* line at x=6px, passing through dot centers (dot: left-[3px] to left-[10px], center=6.5px) */}
                    <div className="absolute left-[6px] top-[0.55rem] bottom-[0.55rem] w-px bg-zinc-200 dark:bg-zinc-800" />
                    {timelineItems.map((item, i) => (
                      <motion.div
                        key={item.year}
                        variants={VARIANTS_INTRO_LINE}
                        className="relative mb-4 last:mb-0 pl-5"
                      >
                        {/* dot: left-[3px], width 7px → center at 6.5px ≈ line */}
                        <span className="absolute left-[3px] top-[0.35rem] h-[7px] w-[7px] rounded-full bg-zinc-400 dark:bg-zinc-600 ring-2 ring-zinc-50 dark:ring-zinc-950" />
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">{item.year}</span>
                          <span className="text-[0.82rem] font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                        </div>
                        <p className="text-[0.8rem] leading-relaxed text-zinc-500 dark:text-zinc-400">{item.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
          </div>
        </motion.section>

        {/* Results bar (appears after clicking a tag) */}
        {selectedTag ? (
          <motion.section
            variants={VARIANTS_SECTION}
            transition={TRANSITION_SECTION}
            className="-mt-6"
          >
            <div
              ref={resultsBarRef}
              className="scroll-mt-28 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/50 bg-zinc-50/40 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-900/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  Filtered by
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                >
                  {selectedTag}
                  <span className="text-white/50 dark:text-zinc-400">×</span>
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                <span className="tabular-nums">{totalResults} result{totalResults === 1 ? '' : 's'}</span>
                <span className="text-zinc-200 dark:text-zinc-700">·</span>
                <span className="tabular-nums">{featuredProjects.length} featured</span>
                <span className="text-zinc-200 dark:text-zinc-700">·</span>
                <span className="tabular-nums">{liveProjects.length} live projects</span>
                <span className="text-zinc-200 dark:text-zinc-700">·</span>
                <span className="tabular-nums">{otherProjects.length} other projects</span>
              </div>
            </div>

            {totalResults === 0 ? (
              <div className="mt-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/40 p-5 text-sm text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:text-zinc-300">
                No projects found for{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedTag}
                </span>
                .{' '}
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="font-semibold text-zinc-900 dark:text-zinc-100 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-500 dark:hover:decoration-zinc-400"
                >
                  Clear filter
                </button>
                .
              </div>
            ) : null}
          </motion.section>
        ) : null}

         {/* Featured Projects */}
         {featuredProjects.length ? (
           <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                 Featured projects
               </h3>
             </div>
             <motion.div
               layout
               transition={TRANSITION_LAYOUT}
               className="grid grid-cols-1 gap-6 sm:grid-cols-2"
             >
               {featuredProjects.map((project) => (
                 <motion.div
                   key={project.id}
                   layout="position"
                   transition={TRANSITION_LAYOUT}
                   {...HOVER_CARD}
                   className="group/card"
                 >
                   <div className="space-y-3">
                     <div className="relative rounded-xl p-[2px]">
                       <GlowEffect
                         colors={['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#3b82f6']}
                         mode="rotate"
                         blur="soft"
                         duration={4}
                         scale={1.0}
                         className="rounded-xl opacity-60 dark:opacity-80"
                       />
                       <div className="relative rounded-[10px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                         {project.video ? (
                           <ProjectVideo src={project.video} thumbnail={project.thumbnail} projectLink={project.link} />
                         ) : (
                           <ProjectImageCard
                             thumbnail={project.thumbnail}
                             name={project.name}
                             link={project.link}
                           />
                         )}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         {project.link ? (
                           <a
                             className="group/link relative inline-block text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                             href={project.link}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                             {project.name}
                             <span className="absolute -bottom-0.5 left-0 block h-px w-full max-w-0 bg-current transition-all duration-300 group-hover/link:max-w-full"></span>
                           </a>
                         ) : (
                           <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                             {project.name}
                           </span>
                         )}
                         {project.video && isYoutube(project.video) ? (
                           <a href={project.video} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.name} on YouTube`} className="group/yt inline-flex items-center gap-1 overflow-hidden rounded-full bg-red-50 px-1.5 py-0.5 text-red-500 transition-all duration-300 hover:bg-red-100 hover:px-2.5 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                             <Youtube className="h-3.5 w-3.5 shrink-0" />
                             <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/yt:max-w-[5rem]">Watch demo</span>
                           </a>
                         ) : null}
                         {(project.repo || isGithub(project.link)) ? (
                           <a href={project.repo || project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`} className="group/gh inline-flex items-center gap-1 overflow-hidden rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-200 hover:px-2.5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                             <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                             <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/gh:max-w-[4rem]">GitHub</span>
                           </a>
                         ) : null}
                       </div>
                      <TagPills
                        tags={project.tags}
                        onTagClick={toggleTag}
                        activeTag={selectedTag}
                      />
                       {project.date && project.result ? (
                         <div className="flex items-center gap-2 pt-1">
                           <span className="text-xs text-zinc-400 dark:text-zinc-500">
                             {project.date}
                           </span>
                           <span className="text-zinc-200 dark:text-zinc-700">·</span>
                           <span
                             className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                               project.result.toLowerCase().includes('winner') ||
                               project.result.toLowerCase().includes('won')
                                 ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                                 : project.result.toLowerCase().includes('funded')
                                   ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                   : project.result.toLowerCase().includes('2nd') ||
                                       project.result.toLowerCase().includes('place')
                                     ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                     : 'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400'
                             }`}
                           >
                             {project.result}
                           </span>
                         </div>
                       ) : null}
                       <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                         {project.description}
                       </p>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
           </motion.section>

         ) : null}

         {/* Live Projects */}
         <motion.section
           variants={VARIANTS_SECTION}
           transition={TRANSITION_SECTION}
         >
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
               Stuff I built that{' '}
               <span className="relative inline-block">
                 people are actually using rn.
                 <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                   <motion.path d="M1,5 C15,4 25,6 40,4 C55,2 65,6 80,4 C95,2 110,6 130,3 C150,1 170,6 185,4 C192,3 197,5 199,4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.55" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}/>
                   <motion.path d="M2,6.5 C20,5.5 45,7 75,5.5 C105,4 135,7 165,5.5 C180,5 195,6.5 199,6" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}/>
                 </svg>
               </span>
             </h3>
             <span className="text-sm text-zinc-400 dark:text-zinc-500">
               {liveProjects.length} {liveProjects.length === 1 ? 'project' : 'projects'}
             </span>
           </div>
           {liveProjects.length ? (
             <motion.div
               layout
               transition={TRANSITION_LAYOUT}
               className="flex flex-col gap-6"
             >
               {liveProjects.map((project) => (
                 <motion.div
                   key={project.id}
                   layout="position"
                   transition={TRANSITION_LAYOUT}
                   className="group/card"
                 >
                   {/* Mobile: single column, same hierarchy as featured cards */}
                   <div className="block sm:hidden space-y-3">
                     <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                       {project.video ? (
                         <ProjectVideo src={project.video} thumbnail={project.thumbnail} projectLink={project.link} />
                       ) : (
                         <ProjectImageCard thumbnail={project.thumbnail} name={project.name} link={project.link} />
                       )}
                     </div>
                     <div className="space-y-1.5">
                       <div className="flex items-center gap-2">
                         {project.link ? (
                           <a className="group/link relative inline-block font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" href={project.link} target="_blank" rel="noopener noreferrer">
                             {project.name}
                             <span className="absolute -bottom-0.5 left-0 block h-px w-full max-w-0 bg-current transition-all duration-300 group-hover/link:max-w-full" />
                           </a>
                         ) : (
                           <span className="font-semibold text-zinc-900 dark:text-zinc-100">{project.name}</span>
                         )}
                         {project.video && isYoutube(project.video) ? (
                           <a href={project.video} target="_blank" rel="noopener noreferrer" className="group/yt inline-flex items-center gap-1 overflow-hidden rounded-full bg-red-50 px-1.5 py-0.5 text-red-500 transition-all duration-300 hover:bg-red-100 hover:px-2.5 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                             <Youtube className="h-3.5 w-3.5 shrink-0" />
                             <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/yt:max-w-[5rem]">Watch demo</span>
                           </a>
                         ) : null}
                         {(project.repo || isGithub(project.link)) ? (
                           <a href={project.repo || project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`} className="group/gh inline-flex items-center gap-1 overflow-hidden rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-200 hover:px-2.5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                             <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                             <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/gh:max-w-[4rem]">GitHub</span>
                           </a>
                         ) : null}
                       </div>
                       <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{project.description}</p>
                     </div>
                     {project.date && project.result ? (
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-zinc-400 dark:text-zinc-500">{project.date}</span>
                         <span className="text-zinc-300 dark:text-zinc-700">·</span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${project.result.toLowerCase().includes('funded') ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'}`}>{project.result}</span>
                       </div>
                     ) : null}
                     <div className="flex items-center gap-3">
                       {project.link ? (
                         <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                           <LinkIcon className="h-3 w-3" />Try it
                         </a>
                       ) : null}
                       {project.video && isYoutube(project.video) ? (
                         <a href={project.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors">
                           <Youtube className="h-3 w-3" />Watch demo
                         </a>
                       ) : null}
                       {project.details ? (
                         <NextLink href={project.details} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                           <BookOpen className="h-3 w-3" />How it's built
                         </NextLink>
                       ) : null}
                     </div>
                     <TagPills tags={project.tags} onTagClick={toggleTag} activeTag={selectedTag} />
                     {project.stats?.length ? (
                       <div>
                         {project.stats.map((stat) => (
                           <div key={stat.label} className="relative overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 px-4 py-3.5 dark:border-zinc-800/60 dark:bg-zinc-900">
                             <motion.span className="pointer-events-none absolute -right-1 -top-2 select-none text-[4.5rem] font-black leading-none text-zinc-100 dark:text-zinc-800/60" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 0.8, ease: 'easeIn' }}>{stat.value}</motion.span>
                             <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                             <div className="flex items-end gap-1.5">
                               <Counter end={stat.value} duration={1.8} fontSize={24} className="text-zinc-900 dark:text-zinc-100" />
                               <span className="text-xs text-zinc-400 dark:text-zinc-500 pb-[5px]">and counting</span>
                             </div>
                             <div className="mt-2.5 flex items-center gap-1.5">
                               <span className="relative flex h-1.5 w-1.5 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
                               <span className="text-[0.68rem] text-zinc-400 dark:text-zinc-500">live on Adobe Express</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : null}
                   </div>

                   {/* Desktop: two-column grid */}
                   <div className="hidden sm:grid sm:grid-cols-2 gap-5">
                     <div className="space-y-2.5">
                       <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                         {project.video ? (
                           <ProjectVideo src={project.video} thumbnail={project.thumbnail} projectLink={project.link} />
                         ) : (
                           <ProjectImageCard thumbnail={project.thumbnail} name={project.name} link={project.link} />
                         )}
                       </div>
                       {project.date && project.result ? (
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-zinc-400 dark:text-zinc-500">{project.date}</span>
                           <span className="text-zinc-300 dark:text-zinc-700">·</span>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                             project.result.toLowerCase().includes('funded')
                               ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                               : project.result.toLowerCase().includes('winner') || project.result.toLowerCase().includes('won')
                                 ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                                 : project.result.toLowerCase().includes('2nd') || project.result.toLowerCase().includes('place')
                                   ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                   : 'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400'
                           }`}>{project.result}</span>
                         </div>
                       ) : null}
                       <div className="flex items-center gap-3 pt-0.5">
                         {project.link ? (
                           <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                             <LinkIcon className="h-3 w-3" />
                             Try it
                           </a>
                         ) : null}
                         {project.video && isYoutube(project.video) ? (
                           <a href={project.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors">
                             <Youtube className="h-3 w-3" />
                             Watch demo
                           </a>
                         ) : null}
                         {project.details ? (
                           <NextLink href={project.details} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                             <BookOpen className="h-3 w-3" />
                             How it's built
                           </NextLink>
                         ) : null}
                       </div>
                       <TagPills tags={project.tags} onTagClick={toggleTag} activeTag={selectedTag} />
                     </div>

                     {/* Right — name, description, stat */}
                     <div className="flex flex-col gap-3 pt-0.5">
                       <div className="space-y-1.5">
                         <div className="flex items-center gap-2">
                           {project.link ? (
                             <a className="group/link relative inline-block font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" href={project.link} target="_blank" rel="noopener noreferrer">
                               {project.name}
                               <span className="absolute -bottom-0.5 left-0 block h-px w-full max-w-0 bg-current transition-all duration-300 group-hover/link:max-w-full" />
                             </a>
                           ) : (
                             <span className="font-semibold text-zinc-900 dark:text-zinc-100">{project.name}</span>
                           )}
                           {project.video && isYoutube(project.video) ? (
                             <a href={project.video} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.name} on YouTube`} className="group/yt inline-flex items-center gap-1 overflow-hidden rounded-full bg-red-50 px-1.5 py-0.5 text-red-500 transition-all duration-300 hover:bg-red-100 hover:px-2.5 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                               <Youtube className="h-3.5 w-3.5 shrink-0" />
                               <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/yt:max-w-[5rem]">Watch demo</span>
                             </a>
                           ) : null}
                           {(project.repo || isGithub(project.link)) ? (
                             <a href={project.repo || project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`} className="group/gh inline-flex items-center gap-1 overflow-hidden rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-200 hover:px-2.5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                               <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                               <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/gh:max-w-[4rem]">GitHub</span>
                             </a>
                           ) : null}
                         </div>
                         <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{project.description}</p>
                       </div>

                       {project.stats?.length ? (
                         <div className="mt-auto">
                           {project.stats.map((stat) => (
                             <div key={stat.label} className="relative overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 px-4 py-3.5 dark:border-zinc-800/60 dark:bg-zinc-900">
                                 <motion.span
                                   className="pointer-events-none absolute -right-1 -top-2 select-none text-[4.5rem] font-black leading-none text-zinc-100 dark:text-zinc-800/60"
                                   aria-hidden
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   transition={{ delay: 2.8, duration: 0.8, ease: 'easeIn' }}
                                 >{stat.value}</motion.span>
                                 <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                                 <div className="flex items-end gap-1.5">
                                   <Counter end={stat.value} duration={1.8} fontSize={24} className="text-zinc-900 dark:text-zinc-100" />
                                   <span className="text-xs text-zinc-400 dark:text-zinc-500 pb-[5px]">and counting</span>
                                 </div>
                                 <div className="mt-2.5 flex items-center gap-1.5">
                                   <span className="relative flex h-1.5 w-1.5 shrink-0">
                                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                     <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                   </span>
                                   <span className="text-[0.68rem] text-zinc-400 dark:text-zinc-500">live on Adobe Express</span>
                                 </div>
                             </div>
                           ))}
                         </div>
                       ) : null}
                     </div>
                   </div>{/* end desktop grid */}
                 </motion.div>
               ))}
             </motion.div>
           ) : (
             <div className="rounded-2xl border border-zinc-200/50 bg-zinc-50/40 p-5 text-sm text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:text-zinc-300">
               No live projects yet.
             </div>
           )}
         </motion.section>

         {/* Projects Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Stuff I built when I had an{' '}
              <span className="relative inline-block">
                idea and a deadline
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path d="M1,5 C15,4 25,6 40,4 C55,2 65,6 80,4 C95,2 110,6 130,3 C150,1 170,6 185,4 C192,3 197,5 199,4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.55" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}/>
                  <motion.path d="M2,6.5 C20,5.5 45,7 75,5.5 C105,4 135,7 165,5.5 C180,5 195,6.5 199,6" stroke="currentColor" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}/>
                </svg>
              </span>.</h3>
             <div className="flex items-center gap-3">
               {selectedTag ? (
                 <button
                   type="button"
                   onClick={() => setSelectedTag(null)}
                   className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                 >
                   Showing: <span className="text-zinc-900 dark:text-zinc-100">{selectedTag}</span> · Clear
                 </button>
               ) : null}
               <span className="text-sm text-zinc-400 dark:text-zinc-500">
                 {otherProjects.length} {otherProjects.length === 1 ? 'project' : 'projects'}
               </span>
             </div>
          </div>
          <motion.div
            layout
            transition={TRANSITION_LAYOUT}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
             {otherProjects.map((project) => (
              <motion.div
                key={project.id}
                layout="position"
                transition={TRANSITION_LAYOUT}
                {...HOVER_CARD}
                className="group/card"
              >
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {project.video ? (
                      <ProjectVideo src={project.video} thumbnail={project.thumbnail} projectLink={project.link} />
                    ) : (
                      <ProjectImageCard
                        thumbnail={project.thumbnail}
                        name={project.name}
                        link={project.link}
                      />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    {/* Title + Tags row */}
                    <div className="flex items-center gap-2">
                      {project.link ? (
                        <a
                          className="group/link relative inline-block text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.name}
                          <span className="absolute -bottom-0.5 left-0 block h-px w-full max-w-0 bg-current transition-all duration-300 group-hover/link:max-w-full"></span>
                        </a>
                      ) : (
                        <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {project.name}
                        </span>
                      )}
                      {project.video && isYoutube(project.video) ? (
                        <a href={project.video} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.name} on YouTube`} className="group/yt inline-flex items-center gap-1 overflow-hidden rounded-full bg-red-50 px-1.5 py-0.5 text-red-500 transition-all duration-300 hover:bg-red-100 hover:px-2.5 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                          <Youtube className="h-3.5 w-3.5 shrink-0" />
                          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/yt:max-w-[5rem]">Watch demo</span>
                        </a>
                      ) : null}
                      {(project.repo || isGithub(project.link)) ? (
                        <a href={project.repo || project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`} className="group/gh inline-flex items-center gap-1 overflow-hidden rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-200 hover:px-2.5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                          <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.7rem] font-medium transition-all duration-300 group-hover/gh:max-w-[4rem]">GitHub</span>
                        </a>
                      ) : null}
                    </div>

                    {/* Tags */}
                     <TagPills
                       tags={project.tags}
                       onTagClick={toggleTag}
                       activeTag={selectedTag}
                     />
                    
                    {/* Date + Result badge */}
                    {project.date && project.result ? (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {project.date}
                        </span>
                        <span className="text-zinc-200 dark:text-zinc-700">·</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                            project.result.toLowerCase().includes('winner') ||
                            project.result.toLowerCase().includes('won')
                              ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                              : project.result.toLowerCase().includes('funded')
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : project.result.toLowerCase().includes('2nd') ||
                                    project.result.toLowerCase().includes('place')
                                  ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                  : 'bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400'
                          }`}
                        >
                          {project.result}
                        </span>
                      </div>
                    ) : null}
                    
                    {/* Description */}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* GitHub Section */}
        <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
          <GitHubContributionsCard username={GITHUB_USERNAME} />
        </motion.section>

        {/* Work Experience Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Experience</h3>
          <div className="flex flex-col space-y-3">
            {WORK_EXPERIENCE.map((job) => (
              <motion.a
                key={job.id}
                {...HOVER_CARD}
                className="group relative overflow-hidden rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                  size={64}
                />
                <div className="relative p-4">
                  <div className="flex w-full flex-row items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {job.title}
                      </h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {job.company}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                      {job.start} · {job.end}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Blog Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Writing</h3>
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {BLOG_POSTS.map((post, index) => (
              <motion.div
                key={post.uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <NextLink
                  href={post.link}
                  className="group flex items-start justify-between gap-4 py-4 -mx-2 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-1">
                      {post.description}
                    </p>
                  </div>
                  <svg
                    className="shrink-0 h-4 w-4 mt-1 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </NextLink>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Connect Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Connect</h3>
          <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
            Reach out at{' '}
            <a 
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-zinc-500 dark:hover:decoration-zinc-400 transition-colors" 
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
          </p>
          <div className="flex items-center flex-wrap gap-2">
            {SOCIAL_LINKS.map((link) => (
              <MagneticSocialLink key={link.label} link={link.link}>
                {link.label}
              </MagneticSocialLink>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 rounded-full bg-zinc-100/80 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-900 hover:text-white dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
      >
        {children}
        <svg
          width="12"
          height="12"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-50 group-hover:opacity-100 transition-opacity"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </Magnetic>
  )
}

type GitHubDay = {
  date: string
  count: number
}

type GitHubContribResponse = {
  username: string
  total: number
  contributions: GitHubDay[]
}

function formatShortMonth(d: Date) {
  return d.toLocaleString('en-US', { month: 'short' })
}

function formatLongDate(d: Date) {
  return d.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function startOfWeekSunday(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - copy.getDay())
  return copy
}

function addDays(d: Date, days: number) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + days)
  return copy
}

function dayKey(d: Date) {
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10)
}

function levelForCount(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0
  const r = count / max
  if (r <= 0.25) return 1
  if (r <= 0.5) return 2
  if (r <= 0.75) return 3
  return 4
}

function levelClass(level: number) {
  // Monochrome (GitHub-like intensity) in zinc scale
  switch (level) {
    case 0:
      return 'bg-zinc-200/60 dark:bg-zinc-800/70'
    case 1:
      return 'bg-zinc-300 dark:bg-zinc-700'
    case 2:
      return 'bg-zinc-400 dark:bg-zinc-600'
    case 3:
      return 'bg-zinc-600 dark:bg-zinc-300'
    case 4:
      return 'bg-zinc-900 dark:bg-zinc-100'
    default:
      return 'bg-zinc-200/60 dark:bg-zinc-800/70'
  }
}

function GitHubContributionsCard({ username }: { username: string }) {
  const [data, setData] = useState<GitHubContribResponse | null>(null)
  const [error, setError] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isLoading = !data && !error

  // Measure container width
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(container)
    // Initial measurement
    setContainerWidth(container.offsetWidth)

    return () => observer.disconnect()
  }, [])

  // Fetch data
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(false)
        const res = await fetch(`/api/github-contributions/${username}`)
        if (!res.ok) throw new Error('failed')
        const json = (await res.json()) as GitHubContribResponse
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setError(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username])

  // Calculate how many weeks fit in the container
  // Each week: 10px square + 3px gap = 13px
  // Day labels: ~32px
  const WEEK_WIDTH = 13
  const DAY_LABELS_WIDTH = 32

  const numWeeks = useMemo(() => {
    if (containerWidth === 0) return 24 // Default fallback (6 months)
    const availableWidth = containerWidth - DAY_LABELS_WIDTH
    const maxWeeks = Math.floor(availableWidth / WEEK_WIDTH)
    // Round down to nearest complete month (4 weeks) to ensure clean month labels
    const completeMonths = Math.floor(maxWeeks / 4)
    const weeks = completeMonths * 4
    // Clamp between 12 weeks (3 months) and 48 weeks (12 months)
    return Math.max(12, Math.min(48, weeks))
  }, [containerWidth])

  // Calculate months from weeks
  const monthsLabel = useMemo(() => {
    return Math.round(numWeeks / 4)
  }, [numWeeks])

  // Compute weeks data based on calculated numWeeks
  const { weeks, monthLabels, maxCount, total } = useMemo(() => {
    const empty = {
      weeks: [] as Array<{ days: Array<{ date: Date; count: number; isFuture: boolean }> }>,
      monthLabels: [] as Array<{ label: string; colSpan: number }>,
      maxCount: 0,
      total: 0,
    }
    if (!data?.contributions?.length) return { ...empty, total: data?.total ?? 0 }

    // Build lookup map from API data
    const map = new Map<string, number>()
    for (const d of data.contributions) {
      map.set(d.date, d.count)
    }

    // Today
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    // Go back the calculated number of weeks
    const endDate = new Date(today)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - (numWeeks * 7))
    // Align start to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay())

    // Generate all days
    const allDays: Array<{ date: Date; count: number; isFuture: boolean }> = []
    let max = 0
    let totalContribs = 0
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = dayKey(d)
      const count = map.get(key) ?? 0
      const isFuture = d > today
      allDays.push({ date: new Date(d), count, isFuture })
      if (!isFuture) {
        if (count > max) max = count
        totalContribs += count
      }
    }

    // Group into weeks (columns)
    const grouped: typeof empty.weeks = []
    for (let i = 0; i < allDays.length; i += 7) {
      const weekDays = allDays.slice(i, i + 7)
      // Pad last week if needed
      while (weekDays.length < 7) {
        weekDays.push({ date: new Date(), count: 0, isFuture: true })
      }
      grouped.push({ days: weekDays })
    }

    // Calculate month labels with column spans
    const labels: typeof empty.monthLabels = []
    let currentMonth = -1
    let currentColSpan = 0
    let currentMonthDate: Date | null = null
    let isFirstMonth = true
    
    for (let i = 0; i < grouped.length; i++) {
      const weekMonth = grouped[i].days[0].date.getMonth()
      if (weekMonth !== currentMonth) {
        if (currentColSpan > 0 && currentMonthDate) {
          // First month: only show label if it has 3+ weeks (enough space for label)
          // Other months: show if 2+ weeks
          const minWeeks = isFirstMonth ? 3 : 2
          if (currentColSpan >= minWeeks) {
            labels.push({
              label: currentMonthDate.toLocaleString('en-US', { month: 'short' }),
              colSpan: currentColSpan,
            })
            isFirstMonth = false
          } else {
            // Partial month with not enough space - add empty spacer
            labels.push({
              label: '',
              colSpan: currentColSpan,
            })
          }
        }
        currentMonth = weekMonth
        currentMonthDate = new Date(grouped[i].days[0].date)
        currentColSpan = 1
      } else {
        currentColSpan++
      }
    }
    // Push last month (always show it)
    if (currentColSpan > 0 && grouped.length > 0) {
      labels.push({
        label: grouped[grouped.length - 1].days[0].date.toLocaleString('en-US', { month: 'short' }),
        colSpan: currentColSpan,
      })
    }

    return {
      weeks: grouped,
      monthLabels: labels,
      maxCount: max,
      total: totalContribs,
    }
  }, [data, numWeeks])

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          {isLoading ? (
            <span className="inline-block w-32 sm:w-44 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          ) : error ? (
            'Unable to load contributions'
          ) : (
            <>{total.toLocaleString()} contributions in the last {monthsLabel} months</>
          )}
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] sm:text-sm text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0"
        >
          @{username}
        </a>
      </div>

      {/* Graph - auto-sized to fit container */}
      <div>
        {/* Month labels */}
        <div className="flex text-xs text-zinc-400 dark:text-zinc-500 mb-2 pl-8">
          {(isLoading
            ? Array(Math.ceil(numWeeks / 4)).fill(null).map((_, i) => ({ label: '', colSpan: 4 }))
            : monthLabels
          ).map((m, i) => (
            <div
              key={i}
              style={{ width: m.colSpan * WEEK_WIDTH }}
              className="text-left"
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col text-xs text-zinc-400 dark:text-zinc-500 pr-2 justify-around h-[91px]">
            <span className="h-[13px] leading-[13px]">Mon</span>
            <span className="h-[13px] leading-[13px]">Wed</span>
            <span className="h-[13px] leading-[13px]">Fri</span>
          </div>

          {/* Squares */}
          <div className="flex gap-[3px]">
            {(isLoading ? Array(numWeeks).fill({ days: Array(7).fill({ count: 0, isFuture: false }) }) : weeks).map(
              (week: any, wi: number) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.days.map((day: any, di: number) => {
                    const level = day.isFuture ? -1 : levelForCount(day.count, maxCount)
                    const title = !day.isFuture && day.date
                      ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatLongDate(day.date)}`
                      : ''
                    return (
                      <div
                        key={di}
                        title={title}
                        className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-200 ease-out ${
                          day.isFuture
                            ? 'bg-transparent'
                            : isLoading
                            ? 'bg-zinc-200 dark:bg-zinc-800 animate-pulse'
                            : `${levelClass(level)} hover:scale-[1.8] hover:rounded-[3px] hover:ring-2 hover:ring-zinc-400/50 dark:hover:ring-zinc-500/50 hover:z-10 cursor-pointer`
                        }`}
                        style={{ transformOrigin: 'center' }}
                      />
                    )
                  })}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`w-[10px] h-[10px] rounded-[2px] transition-transform duration-150 hover:scale-150 cursor-pointer ${levelClass(lvl)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
