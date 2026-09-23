export interface ArchetypeInfo {
  name: string;
  tagline: string;
  manifestationInDream: string;
  psychologicalSignificance: string;
  integrationInquiry: string;
}

export interface DreamSymbol {
  id: string;
  name: string;
  contextInDream: string;
  archetypalMeaning: string;
  personalReflectionQuestion: string;
}

export interface PsychologicalInterpretation {
  coreTheme: string;
  emotionalTone: string;
  recognizedArchetypes: ArchetypeInfo[];
  keySymbols: DreamSymbol[];
  jungianSynthesis: string;
  unconsciousCompensation: string;
  shadowWorkPrompt: string;
  surrealistVisualPrompt: string;
}

export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:4' | '9:16';

export interface SurrealImage {
  url: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  style: string;
  prompt: string;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface DreamEntry {
  id: string;
  title: string;
  date: string;
  recordedAt: string;
  audioUrl?: string;
  audioDurationSec?: number;
  transcript: string;
  wakeMood: string;
  lucidity: number; // 1 - 5
  sleepQuality: number; // 1 - 5
  interpretation?: PsychologicalInterpretation;
  image?: SurrealImage;
  chatHistory: ChatMessage[];
  tags: string[];
}

export type ChatModelChoice = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';
