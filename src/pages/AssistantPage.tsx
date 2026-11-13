import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RotateCcw, Send } from 'lucide-react';
import { AI_PRESET_PROMPTS } from '../lib/demo-data';
import { useUser } from '../hooks/useUser';
import { SeonLogo } from '../components/SeonLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AssistantPage() {
  const { user, preferences } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || busy) return;

    setErrorMsg(null);
    setLastFailedPrompt(null);

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextHistory = [...messages, userMessage];
    const assistantId = `a-${Date.now() + 1}`;

    setMessages([...nextHistory, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    setThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          tone: preferences?.aiTone ?? 'Concise',
        }),
      });

      if (!response.ok) {
        let serverError = `Request failed (${response.status})`;
        try {
          const errJson = (await response.json()) as { error?: string };
          if (errJson.error) serverError = errJson.error;
        } catch {
          // ignore parse failure
        }
        throw new Error(serverError);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming response body unavailable.');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload) as { text?: string; error?: string };
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              setThinking(false);
              accumulated += parsed.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
              );
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
              throw parseErr;
            }
          }
        }
      }

      if (!accumulated) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'No response generated. Please try rephrasing your question.' }
              : m,
          ),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to reach SEON Assistant.';
      setErrorMsg(msg);
      setLastFailedPrompt(trimmed);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setBusy(false);
      setThinking(false);
      window.setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendPrompt(input);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            SEON Assistant
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Gemini-powered energy diagnostics with concise Markdown &amp; GFM table output.
          </p>
        </div>
        <span className="text-xs text-muted">
          Tone: {preferences?.aiTone ?? 'Concise'} · Demo portfolio context
        </span>
      </div>

      {/* Chat container (~70vh) */}
      <div className="flex h-[70vh] min-h-[440px] flex-col rounded-2xl border border-border bg-card overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <SeonLogo size={44} showWordmark={false} />
              <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
                How can I help?
              </h2>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-secondary">
                Ask about building load profiles, HVAC reductions, ESG scores, or request a
                comparison table. Answers stay strictly scoped to your question.
              </p>

              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {AI_PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={busy}
                    onClick={() => void sendPrompt(preset)}
                    className="rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-card-muted disabled:opacity-50"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {isUser ? (
                    user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                        {user?.initials ?? 'U'}
                      </span>
                    )
                  ) : (
                    <SeonLogo size={32} showWordmark={false} className="shrink-0" />
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white whitespace-pre-wrap break-words'
                        : 'border border-border bg-background/70 text-foreground'
                    }`}
                  >
                    {isUser ? (
                      msg.content
                    ) : msg.content ? (
                      <div className="seon-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ children }) => (
                              <div className="seon-table-wrap">
                                <table>{children}</table>
                              </div>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      thinking && (
                        <span className="text-xs text-muted">SEON is thinking…</span>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div
            role="alert"
            className="mx-4 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-500 dark:text-red-400"
          >
            <span>{errorMsg}</span>
            {lastFailedPrompt && (
              <button
                type="button"
                onClick={() => void sendPrompt(lastFailedPrompt)}
                className="inline-flex items-center gap-1 rounded-md border border-red-500/40 px-2.5 py-1 font-medium hover:bg-red-500/10"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* Persistent presets row */}
        <div className="border-t border-border bg-card-muted/30 px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {AI_PRESET_PROMPTS.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={busy}
                onClick={() => void sendPrompt(preset)}
                className="shrink-0 whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-secondary transition-colors hover:text-foreground disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendPrompt(input);
          }}
          className="flex items-end gap-2 border-t border-border bg-card p-3 sm:p-4"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask SEON about consumption, HVAC savings, or ESG metrics…"
            aria-label="Message SEON Assistant"
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            aria-label="Send message"
            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
