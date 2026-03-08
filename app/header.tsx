'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const profileImageUrl = "https://i.imgur.com/tdHUjkg.png"

  return (
    <header className="mb-6 flex items-center">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3"
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Image
            src={profileImageUrl}
            alt="Profile image of Pavushetty Yashwanth Krishna"
            width={48}
            height={48}
            className="rounded-full"
            unoptimized
          />
        </motion.div>

        <div>
          <Link
            href="/"
            className="font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:text-blue-500 dark:hover:text-blue-400"
          >
            Pavushetty Yashwanth Krishna.
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Generative AI Developer.
          </motion.p>
        </div>
      </motion.div>
    </header>
  )
}
