'use client'
import { motion } from 'motion/react'
import { XIcon, PlayCircle, Link as LinkIcon } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import NextLink from 'next/link'
import {
  PROJECTS,
  HACKATHONS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

// Overall container variants for staggering children animations
const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = { duration: 0.3 }

// Smooth hover animation for cards
const HOVER_CARD = {
  whileHover: {
    y: -4,
  },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}

type ProjectVideoProps = {
  src: string
  /** Optional thumbnail image URL for the project. */
  thumbnail?: string
}

/**
 * Helper functions to detect YouTube URLs and generate embed/thumbnail URLs.
 */
function isYoutube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
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
function ProjectVideo({ src, thumbnail }: ProjectVideoProps) {
  const isYoutubeVideo = isYoutube(src)
  // Use the provided thumbnail, or derive one for YouTube if available.
  const triggerThumbnail =
    thumbnail || (isYoutubeVideo ? getYoutubeThumbnail(src) : '')

  return (
    <MorphingDialog transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
      <MorphingDialogTrigger>
        {/* Container with smooth hover effects */}
        <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
          {triggerThumbnail ? (
            <img
              src={triggerThumbnail}
              alt="Project thumbnail"
              className="aspect-video w-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
            />
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
          {/* Play button that appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <PlayCircle className="h-5 w-5 text-zinc-900 dark:text-white" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                Watch Demo
              </span>
            </div>
          </div>
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
            ) : (
              <img
                src={triggerThumbnail}
                alt="Full screen preview"
                className="w-full h-full object-cover"
              />
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
 * HackathonCard with smooth hover animation
 */
function HackathonCard({
  thumbnail,
  name,
  link,
}: {
  thumbnail: string
  name: string
  link: string
}) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
        {/* Image with subtle scale on hover */}
        <img
          src={thumbnail}
          alt={`${name} thumbnail`}
          className="aspect-video w-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        {/* Content that slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center gap-2 text-white">
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm font-medium">View Project</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function Personal() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <motion.main
        className="space-y-24"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        {/* Intro Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <div className="flex-1">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Innovating with AI to build smarter, faster, and more efficient
              applications that automate workflows, enhance decision-making and
              transform user experiences through cutting-edge technology.
            </p>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-5 text-2xl font-medium">Selected Projects</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <motion.div
                key={project.name}
                {...HOVER_CARD}
                className="space-y-2"
              >
                <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <ProjectVideo
                    src={project.video}
                    thumbnail={project.thubmnail}
                  />
                </div>
                <div className="px-1">
                  {project.link ? (
                    <a
                      className="group relative inline-block text-xl font-medium text-zinc-900 dark:text-zinc-50"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name}
                      <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-100 transition-all duration-200 group-hover:max-w-full"></span>
                    </a>
                  ) : (
                    <span className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                      {project.name}
                    </span>
                  )}
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Hackathons Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-5 text-2xl font-medium">Hackathons</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {HACKATHONS.map((hackathon) => (
              <motion.div
                key={hackathon.id}
                {...HOVER_CARD}
                className="space-y-2"
              >
                <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <HackathonCard
                    thumbnail={hackathon.thumbnail}
                    name={hackathon.name}
                    link={hackathon.link}
                  />
                </div>
                <div className="px-1">
                  <a
                    className="group relative inline-block text-xl font-medium text-zinc-900 dark:text-zinc-50"
                    href={hackathon.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {hackathon.name}
                    <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-100 transition-all duration-200 group-hover:max-w-full"></span>
                  </a>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {hackathon.date}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      hackathon.result.toLowerCase().includes('winner') || hackathon.result.toLowerCase().includes('won')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : hackathon.result.toLowerCase().includes('funded')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : hackathon.result.toLowerCase().includes('2nd') || hackathon.result.toLowerCase().includes('place')
                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {hackathon.result}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {hackathon.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Work Experience Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-5 text-2xl font-medium">Work Experience</h3>
          <div className="flex flex-col space-y-4">
            {WORK_EXPERIENCE.map((job) => (
              <motion.a
                key={job.id}
                {...HOVER_CARD}
                className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                  size={64}
                />
                <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                  <div className="flex w-full flex-row justify-between">
                    <div>
                      <h4 className="font-medium dark:text-zinc-100">
                        {job.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {job.company}
                      </p>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {job.start} - {job.end}
                    </p>
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
          <h3 className="mb-5 text-2xl font-medium">Blog</h3>
          <div className="flex flex-col space-y-3">
            {BLOG_POSTS.map((post, index) => (
              <motion.div
                key={post.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <NextLink
                  href={post.link}
                  className="group block relative overflow-hidden rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 p-5 transition-all duration-300 ease-out hover:bg-zinc-200/90 dark:hover:bg-zinc-800/80 hover:scale-[1.02] hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/20 to-transparent dark:via-zinc-600/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  <div className="relative flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-white transition-colors duration-200">
                        {post.title}
                      </h4>
                      <svg
                        className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                      {post.description}
                    </p>
                  </div>
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
          <h3 className="mb-5 text-2xl font-medium">Connect</h3>
          <p className="mb-5 text-lg text-zinc-600 dark:text-zinc-400">
            Feel free to contact me at{' '}
            <a 
              className="text-zinc-900 dark:text-zinc-200 underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-600 hover:decoration-zinc-900 dark:hover:decoration-zinc-300 transition-colors duration-200" 
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
          </p>
          <div className="flex items-center space-x-4">
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
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}
