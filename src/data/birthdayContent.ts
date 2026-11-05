export interface MemoryPhoto {
  src: string
  caption: string
  alt: string
}

export interface StoryChapter {
  number: string
  eyebrow: string
  title: string
  body: string
  date?: string
  motif: 'date' | 'message' | 'stars' | 'moments' | 'future'
}

export interface BirthdayContent {
  name: string
  nickname: string
  timezone: string
  conversationStartDate: string
  birthdayDate: string
  firstMeetingDate: string
  firstMeetingCompleted: boolean
  firstOnlineConnection: string
  platforms: string[]
  locationLabels: [string, string]
  musicSource: string
  musicTitle: string
  heroTitle: string
  heroSubtitle: string
  heroBody: string
  meetingMessage: string
  meetingPastMessage: string
  letter: string[]
  poemLines: string[]
  birthdayMessage: string[]
  wishes: string[]
  specialMessages: string[]
  memoryPhotos: MemoryPhoto[]
  memoryCaptions: string[]
  storyChapters: StoryChapter[]
}

// Vite sets BASE_URL to `/11-11/` in production builds; the fallback keeps
// direct config validation and local development rooted at `/`.
const publicBaseUrl = import.meta.env?.BASE_URL ?? '/'

/**
 * The three ISO timestamps include the explicit IST offset (+05:30). Their
 * instant is therefore stable even when this static site is opened elsewhere.
 * Asia/Kolkata has no daylight-saving transitions.
 */
export const birthdayContent: BirthdayContent = {
  name: 'YOUR SPECIAL PERSON',
  nickname: 'MY 11:11',
  timezone: 'Asia/Kolkata',
  conversationStartDate: '2026-09-04T00:00:00+05:30',
  birthdayDate: '2026-11-17T00:00:00+05:30',
  firstMeetingDate: '2027-09-04T00:00:00+05:30',
  firstMeetingCompleted: false,
  firstOnlineConnection: 'Snapchat',
  platforms: ['Instagram', 'Snapchat'],
  locationLabels: ['ME', 'YOU'],
  musicSource: `${publicBaseUrl}audio/palka-pe-rakhu.mp3`,
  musicTitle: 'Palka Pe Rakhu ♡',
  heroTitle: 'TO MY 11:11',
  heroSubtitle: 'Two places. One connection. One favourite person.',
  heroBody: 'We started with a conversation. We became something special. And someday, I hope distance will just be a memory.',
  meetingMessage: 'Until the day messages become memories.',
  meetingPastMessage: 'The day we hoped for has passed, but our story is still unfolding. If the time and moment are right, another beautiful chapter is waiting for us.',
  letter: [
    'Hey, my 11:11,',
    "I honestly don't know how to put everything into words.",
    "You're not just my best friend. You're someone who has become so much more special to me than I can properly explain.",
    "It's funny how we haven't even met in real life, yet somehow you've become such an important part of my everyday world.",
    'Our story started on 4 September 2026. A conversation on Snapchat, followed by Instagram, Snapchat and all those little moments that slowly became a part of our routine.',
    "I never imagined that someone I hadn't met face to face could mean this much to me.",
    'We have different places, different surroundings and distance between us. But that doesn’t change the fact that what we share is special to me.',
    'Sometimes I think about the day we finally meet.',
    'The day when messages become conversations right beside each other, when the person behind the screen is finally standing in front of me, and when we get to create our first real-life memories.',
    'Until that day, I hope we keep creating beautiful chapters together.',
    'And today, I want you to know one thing.',
    'I genuinely hope life gives you everything beautiful that your heart wishes for.',
    'May your dreams come true. May your smile stay bright. May you find happiness in little things, strength in difficult days and endless reasons to feel proud of yourself.',
    'Thank you for being you.',
    'Thank you for becoming such a special part of my world.',
    'And whenever I see 11:11, I’ll always have one particular person in mind.',
    'Happy Birthday, my favourite 11:11.',
    'With all my heart.'
  ],
  poemLines: [
    'Kabhi haqikat kabhi kahwab lag the ho',
    'Thum Tut huye chand ke tukade lag the ho',
    '',
    'Kon kheta hai ki tum sirf gulab lag te ho',
    'Meri aakhon se khud ko Jara gor se dheko',
    'Tum tho pure fulo ka Bagan lag te ho 🎀💐',
    '',
    'Ki tere pair Chu lu agr tho raaht mil jaye',
    'Tere kadmo mai mujhe Meri janat mil jaye',
    'Or kon kheta hai ladke chute nahi ladkiyon ke pair',
    'Agr mujhe moka mile tho meri jindagi sambhal jaye',
    '',
    'Ki aakho se door ho, Dil se kaha jaogi',
    'Aabhi tho door magar kabhi na kabhi mere paas aao gi',
    'Ki dheka nahi hai tera chehra kabhi karib se',
    'Milo gi tho ye chaand ka tukada dhiko gi',
    'Kahyr abhi tho paas nahi ho tum mere',
    'Par ek waqt aaye ga jab tum mere saath ho jao  gi',
    '',
    'Mai karu thum se mohabbat agr tum ijjat do',
    'Mai likhu tere bare me kuch agr thum ijjat do',
    'Or tum phuch te ho n kay kar sak tha hu thumara liye',
    'Mai Teri maang bhar du agr tum mujhe ijaat do'
  ],
  birthdayMessage: [
    'Happy Birthday to someone who is much more than just a friend.',
    'I hope today brings you the same happiness that your presence brings into my life.',
    'Keep shining. Keep dreaming. Keep being yourself.',
    'Never stop believing in the beautiful things waiting for you.',
    'And whenever distance feels a little too much, remember that someone is genuinely looking forward to the day our story gets its first real-life chapter.',
    'Until then, here’s to every conversation, every smile and everything still waiting for us.',
    'Happy Birthday, my 11:11.'
  ],
  wishes: [
    'May your smile never lose its magic.',
    'May every dream you carry find its way to reality.',
    'May your life always have beautiful surprises.',
    'May you never run out of reasons to be happy.',
    'May you always know how special you are.',
    'May happiness find you in the smallest moments.'
  ],
  specialMessages: [
    'Your presence makes a difference.',
    'You deserve every beautiful thing life has to offer.',
    'Never underestimate how special you are.',
    'Keep smiling. The world needs more of that smile.',
    'Some people are simply irreplaceable.',
    'Your happiness will always matter.',
    'You are someone’s favourite notification.'
  ],
  memoryPhotos: [
    { src: `${publicBaseUrl}photos/memory-01.jpg`, caption: 'A little glimpse, kept close.', alt: 'Close-up portrait' },
    { src: `${publicBaseUrl}photos/memory-02.jpg`, caption: 'A little colour, a little you.', alt: 'Portrait among bright pink flowers' },
    { src: `${publicBaseUrl}photos/memory-03.jpg`, caption: 'One of my favourite photos of you.', alt: 'Portrait in a teal top' },
    { src: `${publicBaseUrl}photos/memory-04.jpg`, caption: 'A glimpse into your world.', alt: 'Portrait at a beautifully lit temple' },
    { src: `${publicBaseUrl}photos/memory-05.jpg`, caption: 'A few sunny-day snapshots.', alt: 'Photo collage from a day out' },
    { src: `${publicBaseUrl}photos/memory-06.jpg`, caption: 'Little moments from your adventures.', alt: 'Photo collage from a visit to the Opera House' }
  ],
  memoryCaptions: [
    'One of my favourite little moments.',
    'A memory worth keeping.',
    'Some conversations become memories.',
    'Little things that mean a lot.',
    'One more reason to smile.'
  ],
  storyChapters: [
    { number: '01', eyebrow: 'THE BEGINNING', title: 'An ordinary day, made special', body: 'An ordinary day that unknowingly became the beginning of something special.', date: '04.09.2026', motif: 'date' },
    { number: '02', eyebrow: 'OUR FIRST ONLINE CONNECTION', title: 'A hello on Snapchat', body: 'It started on Snapchat. No idea how important those little conversations would eventually become.', motif: 'message' },
    { number: '03', eyebrow: 'TWO PLACES', title: 'Different places, growing closer', body: 'Different locations. Different surroundings. But somehow our conversations brought us closer.', motif: 'stars' },
    { number: '04', eyebrow: 'THE LITTLE MOMENTS', title: 'A little world of our own', body: 'The little messages, random conversations, updates, smiles and those moments when talking to you became a favourite part of my day.', motif: 'moments' },
    { number: '05', eyebrow: 'STILL UNFOLDING', title: 'Our story is still unfolding', body: "We haven't met in person yet. But our story has already started. And somewhere on our timeline, there is a date we are both looking forward to.", date: '04 SEPTEMBER 2027', motif: 'future' }
  ]
}

export const dateLabels = {
  conversation: '04 SEPTEMBER 2026',
  birthday: '17 NOVEMBER 2026',
  meeting: '04 SEPTEMBER 2027'
} as const

/** Returns editable-content issues without making optional fields fatal. */
export function validateBirthdayContent(value: BirthdayContent): string[] {
  const issues: string[] = []
  for (const [key, date] of Object.entries({
    conversationStartDate: value.conversationStartDate,
    birthdayDate: value.birthdayDate,
    firstMeetingDate: value.firstMeetingDate
  })) {
    if (typeof date !== 'string' || !Number.isFinite(Date.parse(date))) issues.push(`${key} must be a valid ISO date.`)
    else if (!date.endsWith('+05:30')) issues.push(`${key} must include its explicit Asia/Kolkata (+05:30) offset.`)
  }
  if (!value.timezone) issues.push('timezone is required for date labels.')
  if (typeof value.musicSource !== 'string' || value.musicSource.trim().length === 0) issues.push('musicSource must point to an audio asset.')
  if (!Array.isArray(value.letter) || value.letter.length === 0) issues.push('letter should contain at least one paragraph.')
  if (!Array.isArray(value.memoryPhotos)) issues.push('memoryPhotos must be an array; each image path is optional.')
  return issues
}
