'use client'
import { motion } from 'framer-motion'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const profileImageUrl = "https://i.imgur.com/tdHUjkg.png"; // Replace this with your image URL

  return (
    <>
      {/* Header UI */}
      <header className="mb-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          {/* Profile Photo */}
          <div className="relative">
            {profileImageUrl && (  // Check if the URL is valid
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Image
                  src={profileImageUrl}  // Pass the valid image URL here
                  alt="Profile image of Pavushetty Yashwanth Krishna"
                  width={50}
                  height={50}
                  className="rounded-full"
                  unoptimized
                />
              </motion.div>
            )}
          </div>

          {/* Name and Animated Text */}
          <div className="ml-4">
            <Link
              href="/"
              className="font-medium text-black dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-400"
            >
              Pavushetty Yashwanth Krishna.
            </Link>
            <TextEffect
              as="p"
              preset="fade"
              per="char"
              className="text-zinc-500 dark:text-zinc-500"
              delay={0.5}
            >
              Generative AI Developer.
            </TextEffect>
          </div>
        </motion.div>
      </header>
    </>
  )
}
