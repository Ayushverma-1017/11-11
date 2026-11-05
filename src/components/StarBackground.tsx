import { useEffect, useRef } from 'react'

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let animation = 0
    let stars: { x: number; y: number; radius: number; opacity: number; phase: number; speed: number }[] = []
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      stars = Array.from({ length: Math.min(180, Math.floor(width * height / 6400)) }, () => ({
        x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 1.3 + 0.25,
        opacity: Math.random() * 0.5 + 0.16, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.004 + 0.001
      }))
      draw(0)
    }
    const draw = (time: number) => {
      if (!context) return
      context.clearRect(0, 0, width, height)
      stars.forEach(star => {
        const shimmer = reducedMotion ? 1 : 0.55 + Math.sin(time * star.speed + star.phase) * 0.45
        context.beginPath()
        context.fillStyle = `rgba(255, 239, 251, ${star.opacity * shimmer})`
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        context.fill()
      })
      if (!reducedMotion) animation = window.requestAnimationFrame(draw)
    }
    resize()
    if (!reducedMotion) animation = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { window.cancelAnimationFrame(animation); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="star-canvas" aria-hidden="true" />
}
