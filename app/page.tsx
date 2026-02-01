'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { XIcon, PlayCircle, Link as LinkIcon, Sparkles } from 'lucide-react'
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
 * Project image card with smooth hover animation
 */
function ProjectImageCard({
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const resultsBarRef = useRef<HTMLDivElement | null>(null)

  const filteredProjects = useMemo(() => {
    if (!selectedTag) return PROJECTS
    return PROJECTS.filter((p) => p.tags?.includes(selectedTag))
  }, [selectedTag])

  const featuredProjects = useMemo(() => {
    const onlyFeatured = filteredProjects.filter((p) => p.featured)
    // Ensure consistent order for featured section
    const order = new Map<string, number>([
      ['project-kisan', 0],
      ['project-dev-docs', 1],
    ])
    return onlyFeatured.sort(
      (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
    )
  }, [filteredProjects])

  const otherProjects = useMemo(
    () => filteredProjects.filter((p) => !p.featured),
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
    <div className="container max-w-5xl mx-auto px-4 py-12">
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
          className="space-y-8"
        >
          {/* Tagline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 dark:from-violet-500/20 dark:via-fuchsia-500/20 dark:to-pink-500/20 px-4 py-1.5 ring-1 ring-violet-500/20 dark:ring-violet-400/30">
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                Building with AI
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl">
              Innovating with AI to build smarter, faster, and more efficient
              applications that automate workflows, enhance decision-making and
              transform user experiences through cutting-edge technology.
            </p>
          </div>

          {/* Top filter removed — click tags on projects to filter */}
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
                <span className="tabular-nums">{otherProjects.length} projects</span>
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
                     <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                       {project.video ? (
                         <ProjectVideo src={project.video} thumbnail={project.thumbnail} />
                       ) : (
                         <ProjectImageCard
                           thumbnail={project.thumbnail}
                           name={project.name}
                           link={project.link}
                         />
                       )}
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-start justify-between gap-3">
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

         {/* Projects Section */}
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Projects</h3>
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
                      <ProjectVideo src={project.video} thumbnail={project.thumbnail} />
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
                    <div className="flex items-start justify-between gap-3">
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
                      {job.start} — {job.end}
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
  const isLoading = !data && !error

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

    // Go back exactly 9 months (39 weeks)
    const endDate = new Date(today)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - (39 * 7))
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
    
    for (let i = 0; i < grouped.length; i++) {
      const weekMonth = grouped[i].days[0].date.getMonth()
      if (weekMonth !== currentMonth) {
        if (currentColSpan > 0) {
          labels.push({
            label: new Date(grouped[i - 1].days[0].date).toLocaleString('en-US', { month: 'short' }),
            colSpan: currentColSpan,
          })
        }
        currentMonth = weekMonth
        currentColSpan = 1
      } else {
        currentColSpan++
      }
    }
    // Push last month
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
  }, [data])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isLoading ? (
            <span className="inline-block w-48 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          ) : error ? (
            'Unable to load contributions'
          ) : (
            <>{total.toLocaleString()} contributions in the last 9 months</>
          )}
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          @{username}
        </a>
      </div>

      {/* Graph container */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex text-xs text-zinc-400 dark:text-zinc-500 mb-2 pl-8">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                style={{ width: m.colSpan * 13 }}
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
              {(isLoading ? Array(39).fill({ days: Array(7).fill({ count: 0, isFuture: false }) }) : weeks).map(
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
    </div>
  )
}
