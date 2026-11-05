import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

globalThis.window = {
  location: { search: '', origin: 'http://localhost:5173' },
  addEventListener: () => {},
  removeEventListener: () => {}
}
globalThis.localStorage = { getItem: () => null, setItem: () => {} }

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const renderWithPreview = search => {
    window.location.search = search
    return renderToString(React.createElement(App))
  }

  const page = renderWithPreview('')
  for (const id of ['home', 'meaning', 'story', 'time', 'distance', 'meeting', 'memories', 'poem', 'letter', 'birthday', 'next']) {
    assert.ok(page.includes(`id="${id}"`), `page should render the ${id} section`)
  }
  for (const path of ['memory-01.jpg', 'memory-02.jpg', 'memory-03.jpg', 'memory-04.jpg', 'memory-05.jpg', 'memory-06.jpg']) {
    assert.ok(page.includes(`/photos/${path}`), `gallery should include ${path}`)
  }
  assert.ok(existsSync(new URL('../public/audio/palka-pe-rakhu.mp3', import.meta.url)), 'the selected song should be included as a local asset')
  assert.ok(page.includes('TO MY 11:11'))
  assert.ok(page.includes('04 SEPTEMBER 2026'))
  assert.ok(page.includes('17 NOVEMBER 2026'))
  assert.ok(page.includes('04 SEPTEMBER 2027'))
  assert.ok(page.includes('Kabhi haqikat kabhi kahwab lag the ho'))
  assert.ok(page.includes('/audio/palka-pe-rakhu.mp3'))

  const birthdayPreview = renderWithPreview('?preview=birthday')
  assert.ok(birthdayPreview.includes('HAPPY'))
  assert.ok(birthdayPreview.includes('You deserve the universe'))
  const meetingPreview = renderWithPreview('?preview=meeting')
  assert.ok(meetingPreview.includes('THE DAY WE&#x27;VE BEEN WAITING FOR?') || meetingPreview.includes("THE DAY WE'VE BEEN WAITING FOR?"))
  const meetingPastPreview = renderWithPreview('?preview=meeting-past')
  assert.ok(meetingPastPreview.includes('The day we hoped for has passed'))

  console.log('Render verification passed: sections, supplied media, poem, birthday preview, and meeting previews.')
} finally {
  await vite.close()
}
