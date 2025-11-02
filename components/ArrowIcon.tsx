import React from 'react'
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from 'react-icons/fa'

const icons = {
  Up: FaArrowUp,
  Right: FaArrowRight,
  Down: FaArrowDown,
  Left: FaArrowLeft,
} as const

export default function ArrowIcon({
  type,
  className,
}: {
  type: keyof typeof icons
  className?: string
}) {
  const Icon = icons[type]
  return <Icon className={className} />
}
