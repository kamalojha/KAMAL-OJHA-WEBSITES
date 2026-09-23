import { DreamEntry } from '../types/dream';

export const INITIAL_SAMPLE_DREAMS: DreamEntry[] = [
  {
    id: 'sample-dream-1',
    title: 'The Glass Labyrinth of Melting Hourglasses',
    date: '2026-09-21',
    recordedAt: '2026-09-21T06:45:00.000Z',
    audioDurationSec: 42,
    wakeMood: 'Mystical & Disoriented',
    lucidity: 4,
    sleepQuality: 4,
    transcript:
      'I was wandering through an endless labyrinth suspended over a dark sea. The walls were made of smoked amber glass. Every corner had a brass grandfather clock whose hands were flowing like warm honey down into the salt water below. A masked figure dressed in mirrors walked beside me without speaking. Whenever I tried to look at their face, I saw my own eyes at age eight staring back at me. Then a golden key fell into the ocean and the water turned into birds.',
    interpretation: {
      coreTheme: 'The ego confronting the terrifying yet liberating dissolution of chronological time and unintegrated childhood longing.',
      emotionalTone: 'Haunting awe mixed with melancholic surrender to the irreversible passage of time.',
      recognizedArchetypes: [
        {
          name: 'The Shadow & The Mirrored Self',
          tagline: 'The Hidden Contradiction',
          manifestationInDream: 'The silent figure draped in mirrors reflecting the dreamer at age eight.',
          psychologicalSignificance: 'Represents the dormant inner child who holds forgotten vitality and unmourned developmental milestones that the current adult ego has locked away.',
          integrationInquiry: 'What promise made to yourself in childhood have you dismissed as impractical in your adult waking life?',
        },
        {
          name: 'Chronos / The Senex',
          tagline: 'The Master of Limits & Mortality',
          manifestationInDream: 'Melting brass grandfather clocks whose liquid hands spill into the ocean.',
          psychologicalSignificance: 'Signifies an urgent confrontation with mortality and anxiety over wasted time or impending life transitions.',
          integrationInquiry: 'Where in waking life are you trying to rigidly control deadlines that actually demand patient organic surrender?',
        },
        {
          name: 'The Alchemical Transformation',
          tagline: 'The Transmutation of Gravity',
          manifestationInDream: 'The golden key sinking into water, which immediately erupts into a flock of rising birds.',
          psychologicalSignificance: 'A profound symbol of psychological liberation (sublimatio): relinquishing the grasping desire to unlock everything allows trapped psychic energy to take flight.',
          integrationInquiry: 'What problem would resolve itself if you stopped searching for a rigid master key and allowed yourself to float?',
        },
      ],
      keySymbols: [
        {
          id: 'melting-hourglass',
          name: 'Melting Brass Clocks',
          contextInDream: 'Brass clocks with liquid honey-like hands dripping into the nocturnal sea.',
          archetypalMeaning: 'The collapse of linear waking time (Kronos) into sacred, cyclical archetypal time (Kairos).',
          personalReflectionQuestion: 'Do you feel you are running out of time, or are you awakening to a deeper rhythm?',
        },
        {
          id: 'mirrored-child',
          name: 'The Mirrored Stranger',
          contextInDream: 'Silent companion reflecting the dreamer childhood gaze.',
          archetypalMeaning: 'The Persona confronting the True Self. A threshold encounter with original innocence.',
          personalReflectionQuestion: 'What does that 8-year-old child want to tell your current waking self?',
        },
        {
          id: 'key-into-birds',
          name: 'The Sinking Key Becoming Birds',
          contextInDream: 'A golden key dropped in the ocean transforms the brine into ascending birds.',
          archetypalMeaning: 'Alchemical sublimation: the heavy mineral burden converting into spiritual freedom and inspiration.',
          personalReflectionQuestion: 'What heavy responsibility can you release to let your creativity take wing?',
        },
      ],
      jungianSynthesis:
        'This dream heralds a critical stage in the individuation process. The labyrinth represents the psychic complexity of your conscious mind, where the ego wanders searching for exits. However, the dream gently subverts the need for an exit: time itself is melting, meaning the waking pressures and rigid schedules you impose upon yourself are artificial construct. \n\nBy confronting the mirrored figure with your 8-year-old eyes, your unconscious is staging an encounter with the Divine Child archetype. The sinking key represents surrender: you do not need to "unlock" life with technical answers. When the key is surrendered to the unconscious waters, liberation (the rising birds) occurs spontaneously.',
      unconsciousCompensation:
        'Your waking conscious attitude may be over-identified with hyper-productivity, rigid schedules, and defensive adulthood. The unconscious compensates by stripping away mechanical time and restoring childhood wonder.',
      shadowWorkPrompt:
        'Sit quietly with a photo of yourself as a child. Ask: "What part of my spontaneous self did I bury so I could be perceived as capable and strong?" Write the answer with your non-dominant hand.',
      surrealistVisualPrompt:
        'A magnificent surrealist composition in the style of Salvador Dalí and René Magritte. An endless floating labyrinth of amber glass suspended above an obsidian sea. Towering brass grandfather clocks with golden clockfaces melting over floating checkerboard tiles. A solitary faceless figure in a cape made of polished mirrors reflecting an ethereal golden child. A heavy brass key dissolving into iridescent silver seagulls ascending into a twilight violet sky.',
    },
    image: {
      url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
        <defs>
          <radialGradient id="sky1" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#2e1065"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="sea1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#020408"/>
          </linearGradient>
          <linearGradient id="goldMelt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#sky1)"/>
        <!-- Star clusters -->
        <circle cx="210" cy="140" r="1.5" fill="#fff" opacity="0.9"/>
        <circle cx="340" cy="80" r="2" fill="#fed7aa" opacity="0.8"/>
        <circle cx="780" cy="180" r="1.5" fill="#fff" opacity="0.7"/>
        <circle cx="890" cy="95" r="2.5" fill="#fef08a" opacity="0.9"/>
        <!-- Sea Horizon -->
        <rect y="580" width="1024" height="444" fill="url(#sea1)"/>
        <!-- Labyrinth platforms -->
        <polygon points="120,680 480,560 560,590 160,730" fill="#3b0764" stroke="#c084fc" stroke-width="1.5" opacity="0.8"/>
        <polygon points="460,560 840,640 760,680 390,590" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5" opacity="0.7"/>
        <!-- Melting Clock Motif -->
        <path d="M 420 480 C 420 400, 580 400, 600 480 C 620 560, 560 620, 520 680 C 480 720, 460 640, 440 580 Z" fill="url(#goldMelt)" stroke="#d97706" stroke-width="3" opacity="0.95"/>
        <circle cx="510" cy="510" r="45" fill="#fef9c3" stroke="#b45309" stroke-width="2"/>
        <line x1="510" y1="510" x2="495" y2="485" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
        <line x1="510" y1="510" x2="540" y2="525" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <!-- Sinking Key and Rising Birds -->
        <g stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.85">
          <path d="M 640 520 Q 650 510, 660 520 Q 670 510, 680 520" />
          <path d="M 700 480 Q 712 468, 725 480 Q 738 468, 750 480" />
          <path d="M 760 420 Q 775 405, 790 420 Q 805 405, 820 420" />
          <path d="M 830 360 Q 848 340, 866 360 Q 884 340, 902 360" />
        </g>
        <!-- The Mirrored Figure -->
        <ellipse cx="260" cy="740" rx="30" ry="8" fill="#000" opacity="0.7"/>
        <path d="M 260 620 L 245 735 L 275 735 Z" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
        <circle cx="260" cy="608" r="14" fill="#cbd5e1" stroke="#f8fafc" stroke-width="1.5"/>
        <text x="512" y="970" text-anchor="middle" fill="#e2e8f0" font-family="'Cinzel', serif" font-size="16" letter-spacing="2">THE GLASS LABYRINTH OF MELTING HOURGLASSES</text>
      </svg>`),
      aspectRatio: '1:1',
      imageSize: '2K',
      style: 'Daliesque Metaphysical',
      prompt: 'Surrealist oil canvas of melting clocks in an amber glass labyrinth with mirrored wanderer and birds rising from sea.',
      generatedAt: '2026-09-21T06:46:00.000Z',
    },
    chatHistory: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Why did the mirrored figure have my 8-year-old face instead of an adult reflection?',
        timestamp: '2026-09-21T06:47:00.000Z',
      },
      {
        id: 'msg-2',
        role: 'model',
        content:
          'In Jungian analytical psychology, this mirror encounter is a direct rendezvous with the archetype of the **Puer Aeternus** (the Eternal Child) intertwined with your **Shadow**.\n\nWhen we construct our adult **Persona** (the mask we wear to be functional, responsible, and accepted), we routinely exile the parts of our childhood self that were deemed "too sensitive," "too dreamy," or "unproductive." In this dream, the mirror does not confirm your present adult identity; it tears away the mask and reflects back the uncorrupted witness.\n\nYour 8-year-old self is holding the emotional ledger. They are asking you: *In your rush to beat the clock, what essential joy or creative spark did you leave behind?*',
        timestamp: '2026-09-21T06:47:15.000Z',
        modelUsed: 'gemini-3.1-pro-preview',
      },
    ],
    tags: ['Labyrinth', 'Time', 'Inner Child', 'Shadow', 'Ocean'],
  },
];
