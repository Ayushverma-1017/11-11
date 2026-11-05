# 11:11 — A Little Universe

A static React + TypeScript + Vite site with Tailwind CSS utilities and Motion for React animation. It keeps the conversation beginning, birthday, and hoped-for first meeting as three separate date experiences. All date strings in the content file include the explicit India Standard Time offset (`+05:30`); the browser displays date labels using `Asia/Kolkata`.

## Run locally

Install Node.js, then from this folder run:

```sh
npm install
npm run dev
```

Vite prints the local address. Open it in a browser. The opening intro appears once per browser; use its skip link to jump into the page.

## Personalize the site

Most copy and settings live in [`src/data/birthdayContent.ts`](src/data/birthdayContent.ts).

- Set `name` and `nickname` to personalize the labels. The layout still works if `name` is left generic.
- Edit `letter` to change the complete birthday letter. Each array entry is one paragraph.
- Edit `birthdayMessage`, `poemLines`, `wishes`, `specialMessages`, `storyChapters`, `memoryCaptions`, and `locationLabels` to change the words in those sections.
- Change `conversationStartDate`, `birthdayDate`, and `firstMeetingDate` there. Keep the `+05:30` suffix so the intended midnight in IST stays unambiguous. The countdowns update automatically.
- Change `firstMeetingCompleted` to `true` only after the real first meeting. Until then, the date remains a hope, and the site does not say that you have met.
- The supplied song is included as `public/audio/palka-pe-rakhu.mp3`; `musicSource` and `musicTitle` set its path and display name. Replace that asset and update `musicSource` if you choose another local track. Playback starts only after the intro button or a music control is clicked. The dock includes native audio controls plus play, pause, mute, and retry controls.

## Photos

The six supplied photos are in `public/photos/` and their gallery paths, captions, and alt text are in `memoryPhotos` in the content file. Replace a file at the same path to keep its current caption, or edit the path and caption together. The empty first-meeting frame is intentionally separate; it does not use any of these solo photos.

You can also add more photos from the Memory Gallery’s **Add a real little moment** control. These are stored in this browser’s local storage. They do not upload to a server or travel with a deployed link, so use the `public/photos/` folder and content config for photos that should be included in the site you share. The first-meeting upload appears after you set `firstMeetingCompleted` to `true` and is likewise stored locally in that browser.

## Preview special scenes

Development-only controls appear in the bottom-left corner when running `npm run dev`. They can preview the intro, birthday celebration, first-meeting day, first-meeting date passed, letter, and music controls. You can also open the development URL with `?preview=birthday`, `?preview=meeting`, `?preview=meeting-past`, `?preview=intro`, `?preview=letter`, or `?preview=music`.

These preview controls are compiled out of production builds. Birthday celebration unlocks in production only when the actual configured birthday instant arrives or has passed. The meeting preview does not change the date or mark the meeting complete.

## Build and deploy

```sh
npm run build
npm run preview
```

Run `npm test` for the fixed date arithmetic and server-render checks. These use fixed instants for countdown edges; they do not change the computer clock.

The production site is the static `dist/` directory. Deploy that directory to any static host such as GitHub Pages, Netlify, or Cloudflare Pages, then share the deployed link. Keep `public/photos/` and `public/audio/` with the project so the photo and music assets are included in the build.

## Accessibility and behavior

The site supports keyboard-operated controls, responsive navigation, touch-friendly story and wish interactions, reduced-motion preferences, and lazy-loaded gallery images. Timers calculate from the configured ISO instants and the current system instant, update once each second, and clamp countdowns at zero.
