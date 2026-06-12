import React from 'react'
import {
  Users,
  Bot,
  Workflow,
  GraduationCap,
  Image as ImageIcon,
  Share2,
  Blocks,
  CircleDollarSign,
} from 'lucide-react'

/**
 * Monochrome brand + concept glyphs (inherit `currentColor`) so they sit neatly
 * inside the zinc + red tag/badge pills. Mapped to project tags via TAG_ICONS.
 */

type IconProps = { className?: string }

export function AdobeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 91 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M56.9686 0H90.4318V80L56.9686 0Z" />
      <path d="M33.4632 0H0V80L33.4632 0Z" />
      <path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" />
    </svg>
  )
}

export function OpenAIIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 260" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  )
}

export function GoogleCloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 -25 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="m170.252 56.819 22.253-22.253 1.483-9.37C153.437-11.677 88.976-7.496 52.42 33.92 42.267 45.423 34.734 59.764 30.717 74.573l7.97-1.123 44.505-7.34 3.436-3.513c19.797-21.742 53.27-24.667 76.128-6.168l7.496.39Z" />
      <path d="M224.205 73.918a100.249 100.249 0 0 0-30.217-48.722l-31.232 31.232a55.515 55.515 0 0 1 20.379 44.037v5.544c15.35 0 27.797 12.445 27.797 27.796 0 15.352-12.446 27.485-27.797 27.485h-55.671l-5.466 5.934v33.34l5.466 5.231h55.67c39.93.311 72.553-31.494 72.864-71.424a72.303 72.303 0 0 0-31.793-60.453" />
      <path d="M71.87 205.796h55.593V161.29H71.87a27.275 27.275 0 0 1-11.399-2.498l-7.887 2.42-22.409 22.253-1.952 7.574c12.567 9.489 27.9 14.825 43.647 14.757" />
      <path d="M71.87 61.425C31.94 61.664-.237 94.228.001 134.159a72.301 72.301 0 0 0 28.222 56.88l32.248-32.246c-13.99-6.322-20.208-22.786-13.887-36.776 6.32-13.99 22.786-20.208 36.775-13.888a27.796 27.796 0 0 1 13.887 13.888l32.248-32.248A72.224 72.224 0 0 0 71.87 61.425" />
    </svg>
  )
}

export function AzureIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M33.34 6.54h26.04l-27.03 80.1a4.15 4.15 0 0 1-3.94 2.81H8.15a4.14 4.14 0 0 1-3.93-5.47L29.4 9.38a4.15 4.15 0 0 1 3.94-2.83z" />
      <path d="M71.17 60.26H29.88a1.91 1.91 0 0 0-1.3 3.31l26.53 24.76a4.17 4.17 0 0 0 2.85 1.13h23.38z" />
      <path d="M66.6 9.36a4.14 4.14 0 0 0-3.93-2.82H33.65a4.15 4.15 0 0 1 3.93 2.82l25.18 74.62a4.15 4.15 0 0 1-3.93 5.48h29.02a4.15 4.15 0 0 0 3.93-5.48z" />
    </svg>
  )
}

export function AnthropicIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
  )
}

export function FastAPIIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M128 0C57.33 0 0 57.33 0 128s57.33 128 128 128 128-57.33 128-128S198.67 0 128 0Zm-6.67 230.605v-80.288H76.699l64.128-124.922v80.288h42.966L121.33 230.605Z" />
    </svg>
  )
}

export function SupabaseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 109 113" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
      <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
    </svg>
  )
}

export function ReplicateIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 726 726" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M726 310.438V392.476H438.068V726H346.302V310.438H726Z" />
      <path d="M726 155.219V237.402H264.845V726H173.078V155.219H726Z" />
      <path d="M726 0V82.1832H91.7664V726H0V0H726Z" />
    </svg>
  )
}

// TrueFoundry's logo is a gradient isometric cube; this is a clean monochrome cube glyph.
export function TrueFoundryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 1.5 22 7v10l-10 5.5L2 17V7l10-5.5Zm0 2.3L4.5 8v1.7l7.5 4.1 7.5-4.1V8L12 3.8Zm-7.5 7.6V16l6.5 3.6v-5.1l-6.5-3.6Zm15 0-6.5 3.6v5.1L19.5 16v-4.6Z" />
    </svg>
  )
}

// Gemini's official logo is a gradient/blur spark; this is a clean monochrome 4-point spark.
export function GeminiIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 0C12.5 6.4 17.6 11.5 24 12 17.6 12.5 12.5 17.6 12 24 11.5 17.6 6.4 12.5 0 12 6.4 11.5 11.5 6.4 12 0Z" />
    </svg>
  )
}

/** tag (lowercased) -> glyph. Brand logos where they exist, concept glyphs otherwise. */
export const TAG_ICONS: Record<string, React.FC<IconProps>> = {
  // brands
  adobe: AdobeIcon,
  openai: OpenAIIcon,
  gcp: GoogleCloudIcon,
  azure: AzureIcon,
  claude: AnthropicIcon,
  opus: AnthropicIcon,
  fastapi: FastAPIIcon,
  supabase: SupabaseIcon,
  replicate: ReplicateIcon,
  gemini: GeminiIcon,
  truefoundry: TrueFoundryIcon,
  // concepts (lucide)
  'multi-agent': Users,
  agentic: Bot,
  crewai: Bot,
  automation: Workflow,
  'no-code workflow': Workflow,
  education: GraduationCap,
  image: ImageIcon,
  social: Share2,
  web3: Blocks,
  arc: Blocks,
  circle: CircleDollarSign,
}

// Back-compat alias.
export const BRAND_ICONS = TAG_ICONS
