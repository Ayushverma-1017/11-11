import { useCallback, useEffect, useRef, useState } from 'react'
import { Music2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'
import type { MutableRefObject } from 'react'

interface MusicDockProps {
  source: string
  title: string
  autoStartRef: MutableRefObject<(() => void) | null>
}

export function MusicDock({ source, title, autoStartRef }: MusicDockProps) {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const startPlayback = useCallback(() => {
    setOpen(true)
    setLoadFailed(false)
    const audio = audioRef.current
    if (!audio) return
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false)
      setLoadFailed(true)
    })
  }, [])

  useEffect(() => {
    autoStartRef.current = startPlayback
    return () => { autoStartRef.current = null }
  }, [autoStartRef, startPlayback])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) startPlayback()
    else audio.pause()
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const next = !audio.muted
    audio.muted = next
    setMuted(next)
  }

  return (
    <aside className={open ? 'music-dock music-dock--open' : 'music-dock'} aria-label="Music controls">
      <div className={open ? 'music-panel' : 'music-panel music-panel--closed'} aria-label={`${title} player`} aria-hidden={!open}>
        <div className="music-panel-head"><span><Music2 size={15} /> {title}</span><button onClick={() => setOpen(false)} aria-label="Collapse music player"><X size={16} /></button></div>
        <div className="music-artwork" aria-hidden="true"><span className="music-artwork-orbit" /><span className="music-artwork-disc"><Music2 size={21} /></span><span className="music-artwork-caption">A LITTLE UNIVERSE MIX</span></div>
        <div className="music-audio-wrap">
          <audio
            ref={audioRef}
            src={source}
            preload="none"
            controls
            aria-label={`${title} audio player`}
            onLoadStart={() => setReady(false)}
            onCanPlay={() => { setReady(true); setLoadFailed(false) }}
            onPlay={() => { setPlaying(true); setLoadFailed(false) }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onVolumeChange={event => setMuted(event.currentTarget.muted)}
            onError={() => { setReady(false); setPlaying(false); setLoadFailed(true) }}
          />
          {!ready && !loadFailed && <p className="music-loading">Ready when you are — tap play to listen.</p>}
          {loadFailed && <p className="music-error" role="status">The song couldn’t be played. Check the audio file, then try again.</p>}
        </div>
        <div className="music-controls">
          <button onClick={togglePlayback} aria-label={playing ? 'Pause song' : 'Play song'}>{playing ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}{playing ? 'Pause' : 'Play'}</button>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute song' : 'Mute song'}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}{muted ? 'Unmute' : 'Mute'}</button>
        </div>
        {loadFailed && <button className="music-retry" onClick={startPlayback}><Play size={12} fill="currentColor" /> Try playback again</button>}
      </div>
      <div className="music-pill">
        <button className="music-main-button" onClick={togglePlayback} aria-label={playing ? 'Pause our song' : 'Play our song'}>
          {playing ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}<span>{title}</span>
        </button>
        <button className="music-expand" onClick={() => setOpen(!open)} aria-label={open ? 'Collapse song player' : 'Expand song player'}><Music2 size={16} /></button>
      </div>
    </aside>
  )
}
