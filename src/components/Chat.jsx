import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, FileText, HelpCircle, MessageCircle,
  Loader2, AlertCircle, Sparkles, ArrowDown
} from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import { askQuestion, getSummary, getQuiz } from '../lib/api.js'

const QUICK_PROMPTS = [
  'What is this document about?',
  'What are the key takeaways?',
  'Explain the main argument.',
  'List the most important points.',
]

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-3"
    >
      <div className="h-8 w-8 rounded-xl bg-slate-700/80 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-slate-400" />
      </div>
      <div className="glass-card px-4 py-3 rounded-tl-md flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">AI is thinking</span>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
            className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400"
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Chat({ mode, setMode, sessionId, fileName, messages, addMessage, updateLastAiMessage }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const bottomRef = useRef(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120)
  }

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const handleAsk = useCallback(async (text) => {
    const q = text?.trim() || input.trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    addMessage({ role: 'user', content: q, time: now() })
    setLoading(true)

    try {
      const res = await askQuestion(q, sessionId)
      const answer = res.data?.answer || res.data?.response || res.data?.text || JSON.stringify(res.data)
      addMessage({ role: 'ai', content: answer, time: now() })
    } catch (err) {
      addMessage({ role: 'ai', content: err.message, isError: true, time: now() })
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, sessionId, addMessage])

  const handleSummary = useCallback(async () => {
    if (loading) return
    setMode('summary')
    setError(null)
    addMessage({ role: 'user', content: '📋 Generate a summary of this document', time: now() })
    setLoading(true)

    try {
      const res = await getSummary(sessionId)
      const text = res.data?.summary || res.data?.text || res.data?.response || JSON.stringify(res.data)
      addMessage({ role: 'ai', content: text, type: 'summary', time: now() })
    } catch (err) {
      addMessage({ role: 'ai', content: err.message, isError: true, time: now() })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId, setMode, addMessage])

  const handleQuiz = useCallback(async () => {
    if (loading) return
    setMode('quiz')
    setError(null)
    addMessage({ role: 'user', content: '🧠 Create a quiz from this document', time: now() })
    setLoading(true)

    try {
      const res = await getQuiz(sessionId)
      const questions = res.data?.questions || res.data?.quiz || res.data || []
      addMessage({ role: 'ai', content: Array.isArray(questions) ? questions : [questions], type: 'quiz', time: now() })
    } catch (err) {
      addMessage({ role: 'ai', content: err.message, isError: true, time: now() })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId, setMode, addMessage])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400 shadow-glow-green animate-pulse-slow" />
          <div>
            <p className="text-sm font-semibold text-white leading-none">{fileName}</p>
            <p className="text-xs text-slate-500 mt-0.5">Session active · {messages.filter(m=>m.role==='user').length} queries</p>
          </div>
        </div>

        {/* Mode pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/60 border border-white/[0.06]">
          {[
            { id: 'ask', icon: MessageCircle, label: 'Chat' },
            { id: 'summary', icon: FileText, label: 'Summary', action: handleSummary },
            { id: 'quiz', icon: HelpCircle, label: 'Quiz', action: handleQuiz },
          ].map(({ id, icon: Icon, label, action }) => (
            <button
              key={id}
              onClick={action || (() => setMode(id))}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${mode === id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/25'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
      >
        {/* Empty state */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <div className="h-16 w-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                <Sparkles size={26} className="text-brand-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to explore</h2>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
                Ask anything about <span className="text-slate-300 font-medium">{fileName}</span>.
                You can also generate a summary or quiz.
              </p>

              {/* Quick prompts */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {QUICK_PROMPTS.map(p => (
                  <motion.button
                    key={p}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleAsk(p)}
                    className="px-4 py-2 rounded-xl bg-slate-800/60 border border-white/[0.07] text-slate-400 hover:text-white hover:border-brand-500/30 hover:bg-brand-500/8 text-xs font-medium transition-all duration-200"
                  >
                    {p}
                  </motion.button>
                ))}
              </div>

              {/* Action cards */}
              <div className="flex gap-3 mt-8">
                {[
                  { label: 'Generate Summary', icon: FileText, action: handleSummary, color: 'violet' },
                  { label: 'Start a Quiz', icon: HelpCircle, action: handleQuiz, color: 'green' },
                ].map(({ label, icon: Icon, action, color }) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={action}
                    className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl bg-slate-800/60 border border-white/[0.07] hover:border-brand-500/30 transition-all duration-200 min-w-[120px]"
                  >
                    <Icon size={18} className={color === 'green' ? 'text-green-400' : 'text-violet-400'} />
                    <span className="text-xs font-medium text-slate-400">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message list */}
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} index={i} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom btn */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-8 h-8 w-8 rounded-full bg-slate-700 border border-white/[0.1] flex items-center justify-center shadow-card hover:bg-slate-600 transition-colors duration-200"
          >
            <ArrowDown size={14} className="text-slate-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-6 mb-2 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300 text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-white/[0.05] bg-slate-900/30 backdrop-blur-sm">
        <div className={`relative flex items-end gap-3 rounded-2xl bg-slate-800/70 border transition-all duration-200 p-3
          ${loading ? 'border-white/[0.06] opacity-70' : 'border-white/[0.08] focus-within:border-brand-500/40 focus-within:shadow-glow-brand'}`}>

          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            rows={1}
            placeholder="Ask anything about your document…"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-600 resize-none max-h-32 leading-relaxed py-1 px-1 scrollbar-hide"
            style={{ height: 'auto', minHeight: '24px' }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-slate-600 hidden sm:block">↵ send</span>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleAsk()}
              disabled={!input.trim() || loading}
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${input.trim() && !loading
                  ? 'bg-brand-500 hover:bg-brand-600 shadow-glow-brand text-white'
                  : 'bg-slate-700/60 text-slate-600 cursor-not-allowed'}`}
            >
              {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <Send size={15} />
              }
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-2.5">
          EazeNote may produce inaccurate information. Verify critical details with your source document.
        </p>
      </div>
    </div>
  )
}
