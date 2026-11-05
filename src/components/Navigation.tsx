import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export const navItems = [
  ['Home', 'home'], ['11:11', 'meaning'], ['Our Story', 'story'], ['Our Time', 'time'],
  ['Distance', 'distance'], ['Memories', 'memories'], ['Poem', 'poem'], ['Letter', 'letter'], ['Birthday', 'birthday'], ['Our Next Chapter', 'next']
] as const

export function Navigation() {
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActive(id)
    setMenuOpen(false)
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-nav">
        <button className="nav-mark" onClick={() => goTo('home')} aria-label="Back to the beginning"><span>11:11</span><i>for you</i></button>
        <nav className={menuOpen ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation">
          {navItems.map(([label, id]) => <button key={id} className={active === id ? 'nav-link is-active' : 'nav-link'} onClick={() => goTo(id)}>{label}</button>)}
        </nav>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
    </>
  )
}
