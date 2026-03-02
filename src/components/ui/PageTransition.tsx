import { motion, AnimatePresence } from 'motion/react'
import { useRouterState } from '@tanstack/react-router'

interface PageTransitionProps {
  children: React.ReactNode
}

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
}

export function PageTransition({ children }: PageTransitionProps) {
  const { location } = useRouterState()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Stagger list items
export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  )
}
