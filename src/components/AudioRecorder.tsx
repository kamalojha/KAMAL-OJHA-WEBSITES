import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Sparkles, Upload, Volume2, Moon, Eye, Feather } from 'lucide-react';
import { transcribeAudio } from '../services/api';

interface AudioRecorderProps {
  onTranscriptReady: (transcript: string, wakeMood: string, lucidity: number, sleepQuality: number, audioUrl?: string) => void;
  isProcessing: boolean;
}

const WAKE_MOODS = [
  { label: 'Mystical', color: 'from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Eerie', color: 'from-emerald-500/20 to-slate-800/40 text-emerald-300 border-emerald-500/30' },
  { label: 'Melancholic', color: 'from-blue-500/20 to-indigo-900/30 text-blue-300 border-blue-500/30' },
  { label: 'Euphoric', color: 'from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-500/30' },
  { label: 'Serene', color: 'from-teal-500/20 to-cyan-900/30 text-teal-300 border-teal-500/30' },
  { label: 'Anxious', color: 'from-violet-500/20 to-fuchsia-950/40 text-violet-300 border-violet-500/30' },
];

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscriptReady, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  // Wake state metadata
  const [wakeMood, setWakeMood] = useState('Mystical');
  const [lucidity, setLucidity] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(4);
  const [manualTranscript, setManualTranscript] = useState('');
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  // MediaRecorder & Audio visualizer refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Live browser speech recognition ref for real-time text feedback while speaking
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  // Visualizer loop
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#818cf8'; // Soft indigo glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#6366f1';

    ctx.beginPath();
    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  const startRecording = async () => {
    setTranscribeError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start visualizer
      drawWaveform();

      // Check supported mime types
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      recorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Attempt live SpeechRecognition for realtime display if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (e: any) => {
            let fullText = '';
            for (let i = 0; i < e.results.length; i++) {
              fullText += e.results[i][0].transcript + ' ';
            }
            if (fullText.trim()) {
              setManualTranscript(fullText.trim());
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.debug('Speech recognition not started:', e);
        }
      }
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setTranscribeError('Microphone permission denied or unavailable. You can type your dream below.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    }
  };

  const resetRecording = () => {
    if (isRecording) stopRecording();
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingDuration(0);
    setManualTranscript('');
    setTranscribeError(null);
  };

  const handleTranscribeAndSubmit = async () => {
    setTranscribeError(null);

    // If manual text was typed or edited directly
    if (manualTranscript.trim() && (!audioBlob || activeTab === 'text')) {
      onTranscriptReady(manualTranscript.trim(), wakeMood, lucidity, sleepQuality, audioUrl || undefined);
      return;
    }

    if (!audioBlob) {
      setTranscribeError('Please record audio or type your dream first.');
      return;
    }

    setIsTranscribing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const transcript = await transcribeAudio(base64Data, audioBlob.type);
          const finalTranscript = transcript.trim() || manualTranscript.trim() || 'A waking dream beyond words.';
          setManualTranscript(finalTranscript);
          onTranscriptReady(finalTranscript, wakeMood, lucidity, sleepQuality, audioUrl || undefined);
        } catch (err: any) {
          console.error('Transcription error:', err);
          // If server transcription failed, fall back to whatever speech recognition collected
          if (manualTranscript.trim()) {
            onTranscriptReady(manualTranscript.trim(), wakeMood, lucidity, sleepQuality, audioUrl || undefined);
          } else {
            setTranscribeError(err.message || 'Could not transcribe audio. Please edit the text directly.');
          }
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err: any) {
      setIsTranscribing(false);
      setTranscribeError(err.message || 'Error processing audio file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/80 border border-indigo-950/60 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Subtle background cosmic radial glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Mode switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Morning Oneiric Capture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-dream text-slate-100">
            Record Your Dream While Fresh
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Capture the raw emotional cadence of the subconscious before waking logic alters it.
          </p>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-lg p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'voice'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Voice Record
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            Write / Edit
          </button>
        </div>
      </div>

      {/* Voice Mode Console */}
      {activeTab === 'voice' && (
        <div className="relative z-10 space-y-6">
          {/* Audio Visualizer Canvas */}
          <div className="h-28 w-full bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <canvas ref={canvasRef} width={640} height={112} className="w-full h-full object-cover" />

            {!isRecording && !audioBlob && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
                <Mic className="w-6 h-6 mb-1 opacity-40 text-indigo-400" />
                <span className="text-xs tracking-wider">Tap microphone to begin waking audio capture</span>
              </div>
            )}

            {isRecording && (
              <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-mono text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>REC {formatTime(recordingDuration)}</span>
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio Captured ({formatTime(recordingDuration)})</span>
              </div>
            )}
          </div>

          {/* Record Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={isTranscribing || isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-full font-medium shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Mic className="w-5 h-5 text-indigo-100" />
                <span>{audioBlob ? 'Record Another Take' : 'Start Voice Recording'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full transition-colors cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-medium shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording</span>
                </button>
              </div>
            )}

            {audioBlob && !isRecording && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (audioPlayerRef.current) {
                      if (isPlayingAudio) {
                        audioPlayerRef.current.pause();
                        setIsPlayingAudio(false);
                      } else {
                        audioPlayerRef.current.play();
                        setIsPlayingAudio(true);
                      }
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 rounded-full text-xs font-medium transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'Pause Voice' : 'Play Voice'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetRecording}
                  className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer"
                  title="Clear recording"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            <label className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Audio Clip</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {audioUrl && (
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlayingAudio(false)}
              className="hidden"
            />
          )}
        </div>
      )}

      {/* Transcript Text Preview & Direct Edit Box */}
      <div className="mt-6 relative z-10">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
          <label htmlFor="transcript" className="font-medium text-slate-300">
            {activeTab === 'voice' ? 'Transcribed Narrative (Editable):' : 'Dream Description & Sensory Memories:'}
          </label>
          <span className="text-slate-500">{manualTranscript.length} characters</span>
        </div>
        <textarea
          id="transcript"
          rows={3}
          value={manualTranscript}
          onChange={(e) => setManualTranscript(e.target.value)}
          placeholder="e.g. I was walking across a frozen cathedral above the sea, searching for an ornate pendulum that chimed like wolves..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all resize-y"
        />
      </div>

      {/* Waking Context Metadata Bar */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/70 relative z-10">
        {/* Mood on waking */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Waking Mood:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {WAKE_MOODS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setWakeMood(m.label)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                  wakeMood === m.label
                    ? `bg-indigo-950/60 text-indigo-200 border-indigo-400/50 shadow-sm`
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lucidity Rating */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Lucidity:
            </span>
            <span className="text-indigo-300 font-mono">Level {lucidity}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={lucidity}
            onChange={(e) => setLucidity(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Passive</span>
            <span>Aware</span>
            <span>Fully Lucid</span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Sleep Restfulness:
            </span>
            <span className="text-indigo-300 font-mono">{sleepQuality}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={sleepQuality}
            onChange={(e) => setSleepQuality(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Restless</span>
            <span>Deep REM</span>
          </div>
        </div>
      </div>

      {transcribeError && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300">
          {transcribeError}
        </div>
      )}

      {/* Main Submit & Analyze Action */}
      <div className="mt-6 flex justify-end relative z-10">
        <button
          type="button"
          onClick={handleTranscribeAndSubmit}
          disabled={isTranscribing || isProcessing || (!audioBlob && !manualTranscript.trim())}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:via-indigo-500 hover:to-purple-500 text-slate-950 font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>
            {isTranscribing
              ? 'Transcribing Waking Audio...'
              : isProcessing
              ? 'Unraveling Archetypes & Synthesizing...'
              : 'Transcribe & Interpret Dream'}
          </span>
        </button>
      </div>
    </div>
  );
};
