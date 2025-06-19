"use client"
import { motion, useInView } from "framer-motion"
import type React from "react"

import { useRef } from "react"

interface ScrollAnimationProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollAnimation({ children, delay = 0, className = "" }: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
