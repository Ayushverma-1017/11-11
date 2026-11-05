import { motion } from 'motion/react'
import { useLiveTime } from '../hooks/useLiveTime'
import type { TimeMode } from '../utils/dateMath'

interface TimeCounterProps {
  date: string
  mode: TimeMode
  variant?: 'wide' | 'compact'
  labels?: boolean
  nowOverride?: number
}

export function TimeCounter({ date, mode, variant = 'wide', labels = true, nowOverride }: TimeCounterProps) {
  const { valid, parts } = useLiveTime(date, mode, nowOverride)
  const values = [
    { label: 'DAYS', value: parts.days.toLocaleString('en-IN') },
    { label: 'HOURS', value: String(parts.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(parts.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(parts.seconds).padStart(2, '0') }
  ]

  if (!valid) return <p className="timer-error">This date needs to be checked in the content settings.</p>
  return (
    <div className={`time-counter time-counter--${variant}`} aria-label={mode === 'elapsed' ? 'Time elapsed' : 'Time remaining'}>
      {values.map((part, index) => (
        <motion.div className="time-part" key={part.label} initial={false} animate={{ opacity: 1 }}>
          <span className="time-number" aria-live={part.label === 'SECONDS' ? 'off' : undefined}>{part.value}</span>
          {labels && <span className="time-label">{part.label}</span>}
          {index < values.length - 1 && variant === 'compact' && <span className="time-separator" aria-hidden="true">:</span>}
        </motion.div>
      ))}
    </div>
  )
}
