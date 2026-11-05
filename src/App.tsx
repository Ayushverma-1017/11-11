import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Heart, ImagePlus, Sparkles, Star, X } from 'lucide-react'
import { birthdayContent as content, dateLabels, validateBirthdayContent } from './data/birthdayContent'
import { Navigation } from './components/Navigation'
import { StarBackground } from './components/StarBackground'
import { TimeCounter } from './components/TimeCounter'
import { MusicDock } from './components/MusicDock'
import { isPastTargetDate } from './utils/dateMath'

type PreviewMode = 'birthday' | 'meeting' | 'meeting-past' | 'intro' | 'letter' | 'music' | null
const introKey = '1111-universe-intro-seen'
const galleryKey = '1111-universe-memories'
const meetingPhotoKey = '1111-universe-first-meeting-photo'

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])
  return now
}

function safeStorageGet(key: string) {
  try { return localStorage.getItem(key) } catch { return null }
}

function safeStorageSet(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Site remains usable when storage is unavailable. */ }
}

function loadStoredPhotos() {
  try {
    const value = localStorage.getItem(galleryKey)
    return value ? JSON.parse(value) as string[] : []
  } catch { return [] }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function SectionIntro({ index, eyebrow, title, note }: { index: string; eyebrow: string; title: string; note?: string }) {
  return <div className="section-intro">
    <span className="section-index">{index}</span>
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {note && <p className="section-note">{note}</p>}
  </div>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function IntroScreen({ onEnter, onSkip, reduced }: { onEnter: () => void; onSkip: () => void; reduced: boolean }) {
  const lines = [
    'Some people enter your life unexpectedly…',
    'And somehow, they become your favourite part of every day.',
    'Somewhere between messages, conversations and little moments…',
    'I found my 11:11.'
  ]
  return <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }} transition={{ duration: 1.25, ease: 'easeInOut' }}>
    <div className="intro-nebula intro-nebula--one" /><div className="intro-nebula intro-nebula--two" />
    <div className="intro-content">
      <motion.div className="intro-orbit" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }}>
        <span className="orbit-ring orbit-ring--outer" /><span className="orbit-ring orbit-ring--inner" />
        <span className="intro-star intro-star--a"><Star size={11} fill="currentColor" /></span><span className="intro-star intro-star--b"><Star size={8} fill="currentColor" /></span>
        <span className="intro-clock">11:11</span>
      </motion.div>
      <div className="intro-lines">
        {lines.map((line, index) => <motion.p key={line} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 1 + index * 1.35, duration: 0.9 }}>{line}</motion.p>)}
      </div>
      <motion.p className="intro-final" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 6, duration: 1 }}>
        I made a little universe <i>for you.</i>
      </motion.p>
      <motion.button className="button button--primary intro-cta" onClick={onEnter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 7, duration: 0.8 }}>
        Open your little universe <ArrowRight size={16} />
      </motion.button>
    </div>
    <button className="intro-skip" onClick={onSkip}>Skip intro <ArrowDownRight size={14} /></button>
  </motion.div>
}

function Hero({ onScroll, reduced }: { onScroll: (id: string) => void; reduced: boolean }) {
  const constellation = [[18, 42], [31, 22], [44, 36], [59, 16], [70, 42], [84, 28]]
  return <section id="home" className="hero-section">
    <div className="hero-wash" />
    <div className="hero-constellation" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M18 42 31 22 44 36 59 16 70 42 84 28" /></svg>
      {constellation.map(([x, y], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.32}s` }} />)}
    </div>
    <div className="hero-copy">
      <p className="eyebrow hero-overline"><span /> A LITTLE UNIVERSE, MADE FOR YOU</p>
      <p className="hero-time">11:11</p>
      <h1>{content.heroTitle}</h1>
      <p className="hero-subtitle">{content.heroSubtitle}</p>
      <p className="hero-body">{content.heroBody}</p>
      <div className="hero-date"><span className="line" /><span>{dateLabels.conversation}</span><span className="line" /></div>
      <p className="hero-caption">The beginning of our story.</p>
    </div>
    <button className="scroll-cue" onClick={() => onScroll('meaning')}><span className="scroll-cue-orbit"><ArrowDown size={14} /></span><span>There's a little story waiting for you.</span></button>
    {!reduced && <div className="hero-orb hero-orb--a" aria-hidden="true" />}
  </section>
}

function MeaningSection() {
  const lines = [
    'People say 11:11 is the moment to make a wish.',
    'But somewhere along the way, you became the wish I never knew I needed.',
    'Every time I see 11:11, there’s one person who comes to my mind.'
  ]
  return <section id="meaning" className="meaning-section section-pad">
    <div className="meaning-glow" />
    <div className="meaning-layout">
      <Reveal className="meaning-clock-wrap"><div className="meaning-clock"><span>11:11</span><i /><i /><i /><i /></div><p className="clock-caption">a little wish, every time</p></Reveal>
      <div className="meaning-copy"><SectionIntro index="01 / 09" eyebrow="A LITTLE SIGN FROM THE UNIVERSE" title="Why 11:11?" />
        <div className="meaning-lines">{lines.map((line, i) => <Reveal key={line} delay={i * 0.08}><p>{line}</p></Reveal>)}<Reveal delay={0.25}><p className="meaning-you">You.<span>✦</span></p></Reveal></div>
      </div>
    </div>
  </section>
}

function StorySection({ onScroll }: { onScroll: (id: string) => void }) {
  const [active, setActive] = useState(0)
  const chapter = content.storyChapters[active]
  const next = () => setActive(value => (value + 1) % content.storyChapters.length)
  const previous = () => setActive(value => (value + content.storyChapters.length - 1) % content.storyChapters.length)
  return <section id="story" className="story-section section-pad">
    <div className="story-top"><SectionIntro index="02 / 09" eyebrow="THE FIRST PAGE OF US" title="Imagine meeting someone without actually meeting them." note="Five little chapters. One story that’s still becoming." /></div>
    <div className="story-experience">
      <div className={`story-art story-art--${chapter.motif}`} key={chapter.number}>
        <div className="story-art-grid" />
        {chapter.motif === 'date' && <div className="story-date-mark"><span>04</span><i>SEP</i><span>26</span></div>}
        {chapter.motif === 'message' && <div className="message-orbit"><span className="message-orbit-dot" /><div className="message-notification"><span className="snap-icon">S</span><span><small>THE FIRST HELLO</small><strong>A new connection</strong></span><ArrowUpRight size={16} /></div><div className="message-echo">Some little conversations stay.</div></div>}
        {chapter.motif === 'stars' && <div className="two-stars-art"><span className="far-star far-star--one">ME</span><span className="far-star far-star--two">YOU</span><i className="travel-dot" /></div>}
        {chapter.motif === 'moments' && <div className="moment-stack"><div className="moment-note"><span>little moments</span><i>✦</i></div><div className="moment-note moment-note--back"><span>somehow, my favourite part of the day</span><i>♡</i></div></div>}
        {chapter.motif === 'future' && <div className="future-mark"><span>04</span><i>SEP</i><span>27</span><Heart size={17} /></div>}
        <span className="story-art-label">CHAPTER {chapter.number}</span>
      </div>
      <div className="story-text" aria-live="polite">
        <span className="story-number">{chapter.number}<span> / 05</span></span>
        <p className="eyebrow">{chapter.eyebrow}</p>
        <h3>{chapter.title}</h3>
        <p className="story-body">{chapter.body}</p>
        {chapter.date && <p className="story-date">{chapter.date}</p>}
        {active === 1 && <p className="story-quiet">A digital beginning, with no imagined conversation attached.</p>}
        {active === 4 && <><p className="story-date story-date--future">04 SEPTEMBER 2027</p><p className="story-quiet">Until then, let’s keep creating beautiful chapters.</p><button className="text-link" onClick={() => onScroll('meeting')}>See the date we’re looking forward to <ArrowRight size={15} /></button></>}
        <div className="story-controls"><div className="story-dots">{content.storyChapters.map((item, index) => <button key={item.number} className={active === index ? 'story-dot is-active' : 'story-dot'} onClick={() => setActive(index)} aria-label={`Show chapter ${item.number}`} aria-current={active === index} />)}</div><button className="round-arrow" onClick={previous} aria-label="Previous chapter"><ArrowLeft size={16} /></button><button className="round-arrow" onClick={next} aria-label="Next chapter"><ArrowRight size={16} /></button></div>
      </div>
    </div>
  </section>
}

function ElapsedSection({ now }: { now: number }) {
  const milestones = [
    { title: 'The beginning', meta: dateLabels.conversation, body: 'One ordinary day became the first page of our story.' },
    { title: 'Our first online connection', meta: content.firstOnlineConnection, body: 'A small hello on Snapchat, and a new person in my world.' },
    { title: 'Our little world', meta: content.platforms.join(' & '), body: 'Different apps, all those little messages, and a connection that kept growing.' },
    { title: 'Today', meta: 'STILL TOGETHER, STILL GROWING', body: 'No invented milestone, just another day of our story continuing.' }
  ]
  const [open, setOpen] = useState<number | null>(null)
  return <section id="time" className="time-section section-pad">
    <div className="time-section-glow" />
    <SectionIntro index="03 / 09" eyebrow="ONE SECOND AT A TIME" title="Look how far we've come since that day." />
    <Reveal className="elapsed-counter-shell"><p className="timer-overline">Since the day our conversations began...</p><TimeCounter date={content.conversationStartDate} mode="elapsed" nowOverride={now} /><p className="timer-note">One ordinary day became the beginning of something incredibly special.</p><p className="timer-subnote">From a simple Snapchat connection to someone who became a beautiful part of my everyday life.</p></Reveal>
    <div className="milestone-track">{milestones.map((item, i) => <button key={item.title} className={open === i ? 'milestone is-open' : 'milestone'} onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}><span className="milestone-node">{i === 0 ? '✦' : `0${i + 1}`}</span><span className="milestone-meta">{item.meta}</span><strong>{item.title}</strong><span className="milestone-more">{open === i ? item.body : 'Tap to read a little more'} <ChevronDown size={14} /></span></button>)}</div>
  </section>
}

function DistanceSection() {
  return <section id="distance" className="distance-section section-pad">
    <div className="distance-glow" />
    <SectionIntro index="04 / 09" eyebrow="SOMEWHERE BETWEEN TWO SCREENS" title="Different places. One little universe." />
    <div className="distance-art" aria-label="Two distant stars connected by a line of light">
      <div className="distance-line"><span className="line-particle" /><span className="line-particle line-particle--two" /></div>
      <div className="distance-point distance-point--left"><span className="point-halo" /><span className="point-star">✦</span><b>{content.locationLabels[0]}</b><small>somewhere, under the same sky</small></div>
      <div className="distance-center"><span>✧</span><small>one connection</small></div>
      <div className="distance-point distance-point--right"><span className="point-halo" /><span className="point-star">✦</span><b>{content.locationLabels[1]}</b><small>somewhere, under the same sky</small></div>
    </div>
    <div className="distance-words"><p>We may not share the same physical space, but we share conversations, smiles and moments that mean something to us.</p><p className="distance-italic">The distance is real. So is what we share.</p><p>Somewhere between two screens, we found a connection that became special. Until the day we meet, every conversation adds another little memory to our story.</p></div>
  </section>
}

function MeetingSection({ now, reached, past, completed, photo, onUpload }: { now: number; reached: boolean; past: boolean; completed: boolean; photo: string | null; onUpload: (file: File) => void }) {
  const label = useMemo(() => new Intl.DateTimeFormat('en-IN', { timeZone: content.timezone, dateStyle: 'long' }).format(new Date(Date.parse(content.firstMeetingDate))), [])
  return <section id="meeting" className="meeting-section section-pad">
    <div className="meeting-horizon" />
    <SectionIntro index="05 / 09" eyebrow="A DATE WE'RE LOOKING FORWARD TO" title={content.meetingMessage} note="One day, there won't be a screen between us." />
    <Reveal className="meeting-countdown">
      <div className="meeting-date-block"><span>THE DATE WE'RE HOPING FOR</span><strong>{dateLabels.meeting}</strong><small>{label}</small></div>
      {!completed && !reached ? <TimeCounter date={content.firstMeetingDate} mode="remaining" nowOverride={now} /> : completed ? <div className="meeting-arrived"><span className="meeting-check"><Check /></span><p>OUR FIRST REAL-LIFE CHAPTER</p><h3>A memory we made together.</h3><p>This little space is ready for the real moment, whenever you choose to add it.</p></div> : past ? <div className="meeting-arrived"><span className="meeting-check"><Sparkles /></span><p>STILL A CHAPTER AHEAD</p><h3>{content.meetingPastMessage}</h3><p>The date was a hope, not a promise. Change it in the content settings whenever your plans change.</p></div> : <div className="meeting-arrived"><span className="meeting-check"><Sparkles /></span><p>THE DAY WE'VE BEEN WAITING FOR?</p><h3>Maybe today, all these conversations finally become a real-life memory.</h3><p>The date was a hope, not a promise. Whenever the moment is right, there's another chapter ahead.</p></div>}
      <div className="meeting-quote"><span>“</span><p>I don't know exactly how that moment will feel,<br />but I know it will be a moment worth remembering.</p></div>
    </Reveal>
    <div className="meeting-polaroid-wrap">
      <div className="meeting-light-trail" />
      <div className={`polaroid empty-polaroid ${photo ? 'has-photo' : ''}`}>
        {photo ? <img src={photo} alt="Our first real-life photograph" /> : <div className="polaroid-placeholder"><span className="polaroid-sky"><i /><i /><i /></span><span className="placeholder-cross">+</span><small>{completed ? 'add a real photo when you’re ready' : 'for the day that’s still ahead'}</small></div>}
        <p>{completed ? 'A real memory, kept close.' : 'Reserved for our first real-life photograph.'}</p><small>{dateLabels.meeting}</small>
      </div>
      {completed && <label className="upload-button"><ImagePlus size={15} /> {photo ? 'Change our photo' : 'Add our real photograph'}<input className="sr-only" type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (file) onUpload(file) }} /></label>}
    </div>
  </section>
}

function MemoriesSection({ uploaded, addPhoto }: { uploaded: string[]; addPhoto: (file: File) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const cards = [...content.memoryPhotos, ...uploaded.map((src, index) => ({ src, caption: content.memoryCaptions[index % content.memoryCaptions.length], alt: 'A personal memory you added' }))]
  return <section id="memories" className="memories-section section-pad">
    <SectionIntro index="06 / 09" eyebrow="A PLACE FOR THE REAL THINGS" title="Little moments, big meaning." note="A scrapbook for the memories you choose to keep." />
    <div className="memory-gallery">{cards.map((card, index) => <button className={`memory-card memory-card--${index % 4}`} key={`${card.src || 'empty'}-${index}`} onClick={() => card.src ? setSelected(card.src) : undefined} aria-label={card.src ? `View photo: ${card.caption}` : 'Empty photo placeholder'}>
      <span className="polaroid-image">{card.src ? <img src={card.src} alt={card.alt} loading="lazy" /> : <span className="memory-placeholder"><i className="memory-moon" /><span>little moments<br />live here</span><Sparkles size={16} /></span>}</span>
      <span className="polaroid-caption">{card.caption}</span>
    </button>)}</div>
    <label className="upload-button gallery-upload"><ImagePlus size={15} /> Add a real little moment<input className="sr-only" type="file" accept="image/*" multiple onChange={event => { Array.from(event.target.files ?? []).forEach(addPhoto); event.target.value = '' }} /></label>
    <div className="not-yet-frame"><div className="not-yet-inner"><span className="not-yet-symbol">✧</span><p>THE PICTURE WE HAVEN'T TAKEN YET</p><h3>Our first picture together.</h3><span>This frame is waiting for a memory we haven't made yet.</span><b>{dateLabels.meeting}</b></div></div>
    <AnimatePresence>{selected && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><button aria-label="Close photo" onClick={() => setSelected(null)}><X /></button><motion.img src={selected} alt="Selected memory" initial={{ scale: 0.96 }} animate={{ scale: 1 }} onClick={event => event.stopPropagation()} /></motion.div>}</AnimatePresence>
  </section>
}

function PoemSection() {
  return <section id="poem" className="poem-section section-pad">
    <div className="poem-glow" />
    <SectionIntro index="07 / 10" eyebrow="WORDS, JUST FOR YOU" title="A little poem for my 11:11." note="Your words, held here among the stars." />
    <Reveal className="poem-sheet-wrap">
      <article className="poem-sheet">
        <span className="poem-corner poem-corner--left">✧</span><span className="poem-corner poem-corner--right">✧</span>
        <p className="poem-label">FOR YOU, WITH ALL MY HEART</p>
        <p className="poem-verse">{content.poemLines.join('\n')}</p>
        <div className="poem-signoff"><span /> <i>always your 11:11</i> <span /></div>
      </article>
    </Reveal>
  </section>
}

function MessageCards() {
  const [revealed, setRevealed] = useState<number[]>([])
  return <section className="messages-section section-pad">
    <SectionIntro index="A LITTLE REMINDER" eyebrow="SAVE THESE FOR A CLOUDY DAY" title="A few things I hope you never forget." />
    <div className="message-cards">{content.specialMessages.map((message, index) => {
      const isOpen = revealed.includes(index)
      return <button className={`message-card message-card--${index % 4} ${isOpen ? 'is-revealed' : ''}`} onClick={() => setRevealed(isOpen ? revealed.filter(item => item !== index) : [...revealed, index])} aria-expanded={isOpen} key={message}><span className="message-card-number">0{index + 1}</span><span className="message-card-icon"><Star size={15} /></span><span className="message-card-copy">{isOpen ? message : 'A little thing to remember'}</span><span className="message-card-hint">{isOpen ? 'tap to tuck away' : 'tap to unfold'}</span></button>
    })}</div>
  </section>
}

function WishJar() {
  const [opened, setOpened] = useState<number[]>([])
  const [latest, setLatest] = useState<number | null>(null)
  const choose = (index: number) => {
    setOpened(values => values.includes(index) ? values : [...values, index])
    setLatest(index)
  }
  return <section className="wish-section section-pad">
    <div className="wish-layout"><div className="wish-copy"><SectionIntro index="A POCKETFUL OF HOPE" eyebrow="WISHES, WRAPPED IN STARS" title="A little jar full of wishes for you." note="Pick a star. There's a little wish waiting inside." />
        <div className="wish-output" aria-live="polite">{latest === null ? <><span className="wish-quote-mark">✧</span><p>Each little light holds something I hope life brings your way.</p></> : <><span className="wish-quote-mark">“</span><p>{content.wishes[latest]}</p><span className="wish-count">{opened.length} OF {content.wishes.length} WISHES OPENED</span></>}</div>
      </div><div className="wish-jar-wrap"><div className="wish-glow" /><div className="wish-jar"><div className="jar-lid" /><div className="jar-neck" /><div className="jar-glass"><i className="jar-highlight" />{content.wishes.map((wish, index) => { const positions = [[25, 65], [62, 78], [50, 49], [74, 41], [33, 32], [48, 87]]; const [x, y] = positions[index % positions.length]; return <button key={wish} className={`wish-star ${opened.includes(index) ? 'is-opened' : ''}`} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${index * 0.3}s` }} onClick={() => choose(index)} aria-label={`Open wish ${index + 1}`}><Star size={opened.includes(index) ? 15 : 17} fill="currentColor" /></button> })}</div></div><p className="jar-caption">six little wishes, just for you</p></div></div>
  </section>
}

function LetterSection({ previewOpen = false }: { previewOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(previewOpen)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { if (previewOpen) setIsOpen(true) }, [previewOpen])
  const openLetter = () => { setIsOpen(true); setShowAll(false) }
  return <section id="letter" className="letter-section section-pad">
    <div className="letter-glow" /><SectionIntro index="08 / 10" eyebrow="THE QUIETEST PART OF THIS UNIVERSE" title="The letter from my heart." />
    <div className={`letter-experience ${isOpen ? 'letter-experience--open' : ''}`}>
      {!isOpen ? <div className="letter-envelope"><div className="envelope-flap" /><span className="envelope-seal">11</span><p>There's something I've wanted to tell you...</p><button className="button button--primary" onClick={openLetter}>Open my letter <ArrowRight size={15} /></button></div> : <div className="letter-paper"><span className="letter-topline">A NOTE FROM MY LITTLE UNIVERSE</span><div className="letter-prose">{content.letter.map((paragraph, index) => <p className={index === 0 || index === content.letter.length - 1 ? 'letter-emphasis' : ''} key={`${paragraph}-${index}`} style={{ animationDelay: showAll ? '0s' : `${index * 0.16}s` }}>{paragraph}</p>)}</div><div className="letter-actions"><button className="text-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Read it slowly again' : 'Reveal the whole letter'} <ArrowRight size={14} /></button><span>with all my heart <Heart size={13} fill="currentColor" /></span></div></div>}
    </div>
  </section>
}

function BirthdaySection({ now, unlocked, preview }: { now: number; unlocked: boolean; preview: boolean }) {
  const birthdayDay = new Intl.DateTimeFormat('en-IN', { timeZone: content.timezone, day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(Date.parse(content.birthdayDate))).toUpperCase()
  return <section id="birthday" className={`birthday-section section-pad ${unlocked ? 'birthday-section--unlocked' : ''}`}>
    <div className="birthday-ambience" />
    {!unlocked ? <><SectionIntro index="09 / 10" eyebrow="THE DAY THIS LITTLE UNIVERSE CELEBRATES YOU" title="Your special day is getting closer..." note="Something beautiful is waiting for you." /><div className="birthday-countdown-shell"><div className="birthday-orbit"><span>17</span><i>NOV</i><small>2026</small><Star size={14} fill="currentColor" /></div><p className="timer-overline">Counting every moment until your special day.</p><TimeCounter date={content.birthdayDate} mode="remaining" nowOverride={now} /><p className="timer-note">The world became a little more beautiful because you were born.</p><span className="birthday-date-label">17 NOVEMBER 2026</span></div></> : <div className="birthday-reveal">
      <span className="birthday-kicker"><Sparkles size={14} /> {preview ? 'A LITTLE PREVIEW, JUST FOR YOU' : 'TODAY, THE UNIVERSE CELEBRATES YOU'}</span>
      <div className="birthday-sparkles" aria-hidden="true">{Array.from({ length: 26 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 11) % 100}%`, animationDelay: `${(i % 9) * 0.24}s`, animationDuration: `${3 + i % 4}s` }}>{i % 3 === 0 ? '✦' : '·'}</i>)}</div>
      <p className="birthday-preline">the world became a little more beautiful because you were born</p><h2>HAPPY<br /><em>BIRTHDAY!!!</em></h2><p className="birthday-name">{content.nickname} <span>♡</span></p><p className="birthday-date-label">{birthdayDay}</p><p className="birthday-dedication">Today, the universe celebrates you.</p>
      <div className="birthday-message">{content.birthdayMessage.map((line, i) => <p key={line} style={{ animationDelay: `${i * 0.16}s` }}>{line}</p>)}</div>
      <p className="birthday-grand-finale">Make a wish.<br /><em>You deserve the universe.</em></p><p className="birthday-last-line">Somewhere between two screens, our story began.<br />And this is only the beginning.</p>
    </div>}
  </section>
}

function FinalSection({ onScroll }: { onScroll: (id: string) => void }) {
  return <section id="next" className="next-section section-pad">
    <div className="next-orbit"><span>11:11</span><i /><i /><i /></div>
    <p className="eyebrow">10 / 10 · THE NEXT PAGE IS STILL AHEAD</p><h2>One birthday. One special person.<br />And one more beautiful date on our timeline.</h2>
    <span className="next-date">04 SEPTEMBER 2027</span><p className="next-subtitle">Until the day messages become memories.</p>
    <p className="next-copy">We started as two people behind two screens.<br />I hope someday we become two people standing right next to each other.</p>
    <button className="button button--primary next-button" onClick={() => onScroll('meeting')}>Our next chapter <ArrowUpRight size={16} /></button>
    <p className="next-final-line">Different places today. Hopefully, one beautiful memory together tomorrow.</p>
  </section>
}

function PreviewControls({ onPreview, onMusic }: { onPreview: (mode: PreviewMode) => void; onMusic: () => void }) {
  if (!import.meta.env.DEV) return null
  return <details className="dev-preview"><summary><Sparkles size={13} /> Preview</summary><div><p>Local development only</p><button onClick={() => onPreview('intro')}>Intro screen</button><button onClick={() => onPreview('birthday')}>Birthday finale</button><button onClick={() => onPreview('meeting')}>Meeting day</button><button onClick={() => onPreview('meeting-past')}>Meeting date passed</button><button onClick={() => onPreview('letter')}>Open letter</button><button onClick={onMusic}>Music controls</button><button onClick={() => onPreview(null)}>Clear preview</button></div></details>
}

function App() {
  const now = useNow()
  const reduced = useReducedMotion()
  const previewParam = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('preview') : null
  const initialPreview: PreviewMode = ['birthday', 'meeting', 'meeting-past', 'intro', 'letter', 'music'].includes(previewParam ?? '') ? previewParam as PreviewMode : null
  const [preview, setPreview] = useState<PreviewMode>(initialPreview)
  const [introOpen, setIntroOpen] = useState(() => initialPreview === 'intro' || (!safeStorageGet(introKey) && !reduced))
  const [entered, setEntered] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>(loadStoredPhotos)
  const [meetingPhoto, setMeetingPhoto] = useState<string | null>(() => safeStorageGet(meetingPhotoKey))
  const musicStartRef = useRef<(() => void) | null>(null)
  const contentIsValid = validateBirthdayContent(content).length === 0
  const birthdayUnlocked = Date.parse(content.birthdayDate) <= now || preview === 'birthday'
  const meetingTarget = Date.parse(content.firstMeetingDate)
  const meetingReached = meetingTarget <= now || preview === 'meeting' || preview === 'meeting-past'
  const meetingPast = isPastTargetDate(meetingTarget, now) || preview === 'meeting-past'

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  const enter = () => {
    setEntered(true)
    setIntroOpen(false)
    safeStorageSet(introKey, 'yes')
    musicStartRef.current?.()
    window.setTimeout(() => scrollTo('home'), reduced ? 0 : 100)
  }
  const skipIntro = () => {
    setEntered(true)
    setIntroOpen(false)
    safeStorageSet(introKey, 'yes')
    window.setTimeout(() => scrollTo('home'), reduced ? 0 : 100)
  }
  const savePhoto = (file: File, key: string, onSaved: (value: string) => void) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      onSaved(reader.result)
      safeStorageSet(key, reader.result)
    }
    reader.readAsDataURL(file)
  }
  const addPhoto = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setUploaded(previous => {
        const updated = [...previous, reader.result as string]
        safeStorageSet(galleryKey, JSON.stringify(updated))
        return updated
      })
    }
    reader.readAsDataURL(file)
  }
  const onMeetingPhoto = (file: File) => savePhoto(file, meetingPhotoKey, setMeetingPhoto)

  return <div className={`app-shell ${introOpen ? 'app-shell--intro' : ''}`} data-content-valid={contentIsValid}>
    <StarBackground />
    <div className="ambient ambient--violet" aria-hidden="true" /><div className="ambient ambient--rose" aria-hidden="true" />
    {!introOpen && <Navigation />}
    <main className={introOpen ? 'experience experience--covered' : 'experience'}>
      <Hero onScroll={scrollTo} reduced={reduced} />
      <MeaningSection />
      <StorySection onScroll={scrollTo} />
      <ElapsedSection now={now} />
      <DistanceSection />
      <MeetingSection now={now} reached={meetingReached} past={meetingPast} completed={content.firstMeetingCompleted} photo={content.firstMeetingCompleted ? meetingPhoto : null} onUpload={onMeetingPhoto} />
      <MemoriesSection uploaded={uploaded} addPhoto={addPhoto} />
      <PoemSection />
      <MessageCards />
      <WishJar />
      <LetterSection previewOpen={preview === 'letter'} />
      <BirthdaySection now={now} unlocked={birthdayUnlocked} preview={preview === 'birthday'} />
      <FinalSection onScroll={scrollTo} />
      <footer className="site-footer"><span>11:11</span><p>A little universe, made for you.</p><span>✦</span></footer>
    </main>
    <MusicDock source={content.musicSource} title={content.musicTitle} autoStartRef={musicStartRef} />
    <PreviewControls onPreview={mode => { setPreview(mode); setIntroOpen(mode === 'intro') }} onMusic={() => musicStartRef.current?.()} />
    <AnimatePresence>{introOpen && <IntroScreen key="intro" onEnter={enter} onSkip={skipIntro} reduced={reduced} />}</AnimatePresence>
    {entered && <motion.div className="entry-flash" initial={{ opacity: 0.28 }} animate={{ opacity: 0 }} transition={{ duration: 1.3 }} aria-hidden="true" />}
  </div>
}

export default App
