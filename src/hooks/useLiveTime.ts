import { useEffect, useState } from 'react'
import { calculateTimeParts, type TimeMode } from '../utils/dateMath'

/** A shared one-second clock for elapsed counters and countdowns. */
export function useLiveTime(isoDate: string, mode: TimeMode, nowOverride?: number) {
  const target = Date.parse(isoDate)
  const [now, setNow] = useState(() => nowOverride ?? Date.now())

  useEffect(() => {
    if (nowOverride !== undefined) {
      setNow(nowOverride)
      return
    }
    const tick = () => setNow(Date.now())
    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [nowOverride])

  return {
    valid: Number.isFinite(target),
    target,
    now,
    reached: Number.isFinite(target) && now >= target,
    parts: calculateTimeParts(target, now, mode)
  }
}
