import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Cpu,
  RotateCcw,
  MessageCircle,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { ChatMessage, ChatModelChoice, DreamEntry, DreamSymbol } from '../types/dream';
import { sendSymbolChatMessage } from '../services/api';

interface SymbolChatProps {
  dream: DreamEntry;
  onUpdateChatHistory: (history: ChatMessage[]) => void;
  selectedSymbol?: DreamSymbol | null;
  onClearSelectedSymbol?: () => void;
}

const MODEL_OPTIONS: { id: ChatModelChoice; name: string; tag: string; desc: string }[] = [
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    tag: 'Complex Analysis',
    desc: 'Deepest psychological reasoning & multidimensional Jungian synthesis',
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tag: 'General Tasks',
    desc: 'Balanced, rich oneiric symbology with swift responsiveness',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Fast Lookups',
    desc: 'Ultra-fast symbol dictionary queries and quick reflections',
  },
];

export const SymbolChat: React.FC<SymbolChatProps> = ({
  dream,
  onUpdateChatHistory,
  selectedSymbol,
  onClearSelectedSymbol,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(dream.chatHistory || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ChatModelChoice>('gemini-3.5-flash');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If a symbol was selected from the interpretation cards, pre-populate prompt
  useEffect(() => {
    if (selectedSymbol) {
      setInput(`What is the deeper archetypal meaning of "${selectedSymbol.name}" in this dream, and how should I work with it in my waking life?`);
    }
  }, [selectedSymbol]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (onClearSelectedSymbol) onClearSelectedSymbol();
    setIsLoading(true);

    try {
      const response = await sendSymbolChatMessage(
        text,
        messages,
        dream,
        selectedModel,
      );

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: response.reply,
        timestamp: new Date().toISOString(),
        modelUsed: response.modelUsed || selectedModel,
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      onUpdateChatHistory(finalMessages);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: `The Oracle's reflection was disrupted: ${err.message || 'Please retry in a moment.'}`,
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel,
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      onUpdateChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (confirm('Clear the conversation history with the Oneiric Oracle?')) {
      setMessages([]);
      onUpdateChatHistory([]);
    }
  };

  // Generate suggested quick prompts based on dream symbols
  const suggestedPrompts = [
    ...(dream.interpretation?.keySymbols.slice(0, 2).map((s) => `Why did ${s.name} appear in this dream?`) || []),
    'How does this dream relate to my Shadow?',
    'What action can I take today to honor this dream message?',
  ];

  return (
    <div className="bg-slate-900/90 border border-indigo-950/70 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-[640px]">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-serif-dream text-slate-100">
                The Oneiric Oracle & Symbologist
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Multi-turn dialogue on dream archetypes, symbols, and psychological integration
            </p>
          </div>
        </div>

        {/* Intelligence Model Selector (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ChatModelChoice)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.name} · {m.tag}
                </option>
              ))}
            </select>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Role explanation subtitle banner */}
      <div className="px-5 py-2 bg-indigo-950/40 border-b border-indigo-950/60 text-[11px] text-indigo-300/80 flex items-center justify-between">
        <span>Role: Senior Jungian Psychoanalyst · Dream Context: "{dream.title || 'Current Dream'}"</span>
        <span className="font-mono text-[10px] text-indigo-400/60">{messages.length} exchanges</span>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-serif-dream text-slate-200">
              Interrogate the Unconscious
            </h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-5">
              Ask deep questions about why specific symbols, colors, figures, or emotions manifested in this dream.
            </p>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 bg-slate-950/60 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-full text-xs transition-all cursor-pointer text-left"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 inline mr-1.5" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 shadow-md whitespace-pre-line'
                }`}
              >
                {msg.content}

                <div
                  className={`flex items-center gap-2 mt-2 text-[10px] ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.modelUsed && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{msg.modelUsed}</span>
                    </>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>The Oneiric Oracle is consulting the archetypal lexicon with {selectedModel}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up chips if chat has messages */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-500 shrink-0 font-medium">Suggestions:</span>
          {suggestedPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1 bg-slate-900 hover:bg-indigo-950 text-slate-400 hover:text-indigo-200 border border-slate-800 rounded-md text-[11px] transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a symbol (e.g. 'What does the melting clock signify?')..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
