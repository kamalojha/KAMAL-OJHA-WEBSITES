import {
  PsychologicalInterpretation,
  SurrealImage,
  ImageSize,
  AspectRatio,
  ChatMessage,
  DreamEntry,
  ChatModelChoice,
} from '../types/dream';

export async function transcribeAudio(audioData: string, mimeType: string = 'audio/webm'): Promise<string> {
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioData, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Transcription failed');
  }

  const data = await response.json();
  return data.transcript;
}

export async function interpretDream(
  transcript: string,
  wakeMood: string,
  lucidity: number,
  sleepQuality: number,
): Promise<PsychologicalInterpretation> {
  const response = await fetch('/api/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, wakeMood, lucidity, sleepQuality }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Interpretation failed');
  }

  const data: PsychologicalInterpretation = await response.json();
  return data;
}

export async function generateSurrealImage(
  prompt: string,
  coreTheme: string,
  imageSize: ImageSize = '1K',
  aspectRatio: AspectRatio = '1:1',
  style: string = 'Daliesque Metaphysical',
): Promise<{ image: SurrealImage; isFallback?: boolean; notice?: string }> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, coreTheme, imageSize, aspectRatio, style }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Image generation failed');
  }

  const data = await response.json();
  return {
    image: {
      url: data.imageUrl,
      aspectRatio: data.aspectRatio,
      imageSize: data.imageSize,
      style,
      prompt: data.prompt,
      generatedAt: new Date().toISOString(),
    },
    isFallback: data.isFallbackAtmosphere,
    notice: data.quotaExceededNotice,
  };
}

export async function sendSymbolChatMessage(
  message: string,
  history: ChatMessage[],
  dreamContext: Partial<DreamEntry>,
  model: ChatModelChoice = 'gemini-3.5-flash',
): Promise<{ reply: string; modelUsed: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, dreamContext, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Chat failed');
  }

  return response.json();
}
