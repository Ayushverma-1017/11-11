export interface TimeParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type TimeMode = 'elapsed' | 'remaining'

/** The configured date is midnight IST; Kolkata has no DST, so its date ends 24h later. */
export function isPastTargetDate(target: number, now: number): boolean {
  return Number.isFinite(target) && now >= target + 86_400_000
}

/** Converts two instants to non-negative whole-second elapsed or remaining time. */
export function calculateTimeParts(target: number, now: number, mode: TimeMode): TimeParts {
  const delta = mode === 'elapsed' ? now - target : target - now
  const wholeSeconds = Math.floor(Math.max(0, delta) / 1000)
  return {
    days: Math.floor(wholeSeconds / 86_400),
    hours: Math.floor((wholeSeconds % 86_400) / 3_600),
    minutes: Math.floor((wholeSeconds % 3_600) / 60),
    seconds: wholeSeconds % 60
  }
}
