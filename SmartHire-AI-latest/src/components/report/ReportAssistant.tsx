import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ResumeAnalysisResult } from '../../types/resume';
import { askSmartHireChat } from '../../services/resumeApi';
import { Sparkles, Send, Bot, User, Loader2, HelpCircle, RotateCcw } from 'lucide-react';

interface ReportAssistantProps {
  result: ResumeAnalysisResult;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export const ReportAssistant: React.FC<ReportAssistantProps> = ({ result }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatThreadRef = useRef<HTMLDivElement>(null);

  // Clean up in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Smooth auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const quickPrompts = [
    'How can I address the missing skills from the job description?',
    'How do I raise my Quantified Impact score?',
    'Draft a 3-sentence punchy executive summary.',
    'Provide bullet-point rewrite examples for my recent roles.',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    // Diagnostic timing start
    const t0 = performance.now();
    console.debug('[SmartHire Chat] Click Send -> Request starting');

    // Abort any lingering previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);
    setLastFailedMessage(null);

    const tRequestStart = performance.now();
    console.debug(`[SmartHire Chat] Time to start request: ${(tRequestStart - t0).toFixed(1)}ms`);

    try {
      const history = messages.slice(-3).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await askSmartHireChat(textToSend, result, history, controller.signal);

      const tReceived = performance.now();
      console.debug(`[SmartHire Chat] Backend & Gemini roundtrip: ${(tReceived - tRequestStart).toFixed(1)}ms`);

      if (!controller.signal.aborted) {
        const botMsg: ChatMessage = {
          id: `${Date.now()}-m`,
          role: 'model',
          content: reply,
        };

        setMessages((prev) => [...prev, botMsg]);
        const tRendered = performance.now();
        console.debug(`[SmartHire Chat] Parsing & state update time: ${(tRendered - tReceived).toFixed(1)}ms`);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to reach AI career coach. Please try again.';
        setError(msg);
        setLastFailedMessage(textToSend);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage && !loading) {
      handleSend(lastFailedMessage);
    }
  };

  const isOffline = result.metadata.sourceMode === 'local_offline';

  return (
    <Card className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Ask SmartHire AI
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive career coaching grounded in your current evaluation report
            </p>
          </div>
        </div>

        {isOffline && (
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
            Requires Online Connection
          </span>
        )}
      </div>

      {isOffline && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
          Interactive chat assistant requires an active internet connection to connect to Gemini. Connect online to chat with the AI assistant about your report.
        </div>
      )}

      {/* Suggested Quick Prompts */}
      {messages.length === 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Suggested questions about your report:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className={`text-xs text-left px-3 py-1.5 rounded-lg border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message History Thread */}
      {messages.length > 0 && (
        <div
          ref={chatThreadRef}
          className="space-y-3 max-h-96 overflow-y-auto p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-neutral-800/60"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'model' && (
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-xl max-w-xl whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>SmartHire AI is generating advice...</span>
            </div>
          )}
        </div>
      )}

      {/* Error alert with Retry button */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Coaching Request Error</span>
            <span>{error}</span>
          </div>
          {lastFailedMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={loading}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="self-start sm:self-auto shrink-0 bg-white dark:bg-neutral-900 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100/50"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about improving your resume or addressing gaps..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || loading}
          loading={loading}
          icon={<Send className="w-3.5 h-3.5" />}
        >
          Ask
        </Button>
      </form>
    </Card>
  );
};
