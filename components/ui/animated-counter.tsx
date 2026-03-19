"use client"

import * as React from "react"
import { MotionValue, motion, useSpring, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"

const cn = (...args: any[]) => twMerge(clsx(args))

const fontSize = 30
const padding = 8
const height = fontSize + padding

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  end: number
  duration?: number
  className?: string
  fontSize?: number
}

export const Counter = ({
  end,
  duration = 2,
  className,
  fontSize: fontSizeProp = 30,
  ...rest
}: CounterProps) => {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || !end) return
    const steps = end
    const intervalMs = (duration * 1000) / steps
    const interval = setInterval(() => {
      setValue((prev) => {
        if (prev >= end) { clearInterval(interval); return end }
        return prev + 1
      })
    }, intervalMs)
    return () => clearInterval(interval)
  }, [started, end, duration])

  return (
    <div
      ref={ref}
      style={{ fontSize: fontSizeProp }}
      {...rest}
      className={cn("flex overflow-hidden leading-none font-bold tabular-nums", className)}
    >
      {value >= 10000 && <Digit place={10000} value={value} fontSizeProp={fontSizeProp} />}
      {value >= 1000 && <Digit place={1000} value={value} fontSizeProp={fontSizeProp} />}
      {value >= 100 && <Digit place={100} value={value} fontSizeProp={fontSizeProp} />}
      {value >= 10 && <Digit place={10} value={value} fontSizeProp={fontSizeProp} />}
      <Digit place={1} value={value} fontSizeProp={fontSizeProp} />
    </div>
  )
}

function Digit({ place, value, fontSizeProp }: { place: number; value: number; fontSizeProp: number }) {
  const h = fontSizeProp + padding
  const valueRoundedToPlace = Math.floor(value / place)
  const animatedValue = useSpring(valueRoundedToPlace, { stiffness: 80, damping: 18 })

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  return (
    <div style={{ height: h }} className="relative w-[0.6em]">
      {[...Array(10)].map((_, i) => (
        <Number key={i} mv={animatedValue} number={i} h={h} />
      ))}
    </div>
  )
}

function Number({ mv, number, h }: { mv: MotionValue; number: number; h: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * h
    if (offset > 5) memo -= 10 * h
    return memo
  })

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  )
}
