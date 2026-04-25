import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Sparkles, User, AlertTriangle } from 'lucide-react'
import QuizCard from './QuizCard.jsx'

export default function MessageBubble({ message, index }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        typeof message.content === 'string' ? message.content : JSON.stringify(message.content)
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3), ease: 'easeOut' }}
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center
        ${isUser
          ? 'bg-brand-500/20 border border-brand-500/30'
          : message.isError
            ? 'bg-red-500/15 border border-red-500/25'
            : 'bg-slate-700/80 border border-white/[0.08]'
        }`}>
        {isUser
          ? <User size={14} className="text-brand-400" />
          : message.isError
            ? <AlertTriangle size={14} className="text-red-400" />
            : <Sparkles size={14} className="text-slate-400" />
        }
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-brand-500/90 text-white rounded-tr-md shadow-glow-brand'
            : message.isError
              ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-md'
              : 'glass-card text-slate-200 rounded-tl-md'
          }`}>

          {/* Quiz content */}
          {message.type === 'quiz' && Array.isArray(message.content) ? (
            <div className="space-y-4 min-w-[320px]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.07]">
                <div className="h-6 w-6 rounded-lg bg-brand-500/20 flex items-center justify-center">
                  <span className="text-xs">🧠</span>
                </div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Knowledge Quiz</p>
                <span className="ml-auto text-xs text-slate-500">{message.content.length} questions</span>
              </div>
              {message.content.map((q, i) => <QuizCard key={i} question={q} index={i} />)}
            </div>
          ) : message.type === 'summary' ? (
            <div className="min-w-[280px]">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.07]">
                <span className="text-sm">📋</span>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Document Summary</p>
              </div>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Copy button (AI only) */}
        {!isUser && !message.isTyping && typeof message.content === 'string' && (
          <motion.button
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn-ghost text-xs py-1 px-2 self-start"
          >
            {copied
              ? <><Check size={11} className="text-green-400" /> Copied</>
              : <><Copy size={11} /> Copy</>
            }
          </motion.button>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-slate-600 px-1">
          {message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}
