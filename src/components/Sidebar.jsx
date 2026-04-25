import { motion } from 'framer-motion'
import {
  Sparkles, MessageCircle, FileText, HelpCircle,
  Trash2, Sun, Moon, CheckCircle2, FileUp, ChevronRight
} from 'lucide-react'

const NAV = [
  { id: 'ask',     icon: MessageCircle, label: 'Ask AI',   desc: 'Chat with your doc' },
  { id: 'summary', icon: FileText,      label: 'Summary',  desc: 'Generate overview' },
  { id: 'quiz',    icon: HelpCircle,    label: 'Quiz Me',  desc: 'Test your knowledge' },
]

export default function Sidebar({ dark, setDark, mode, setMode, fileName, sessionId, clearChat }) {
  return (
    <aside className="relative z-10 flex h-screen w-64 flex-shrink-0 flex-col border-r border-white/[0.06] bg-slate-900/70 backdrop-blur-2xl">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.05]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 border border-brand-500/30">
          <Sparkles size={17} className="text-brand-400" />
        </div>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-white leading-none">
            Eaze<span className="text-brand-400">Note</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide uppercase">AI Document Assistant</p>
        </div>
      </div>

      {/* File status */}
      <div className="mx-3 mt-3 mb-1">
        <motion.div
          initial={false}
          animate={sessionId ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
          className={`rounded-xl border p-3 ${
            sessionId
              ? 'border-green-500/25 bg-green-500/8'
              : 'border-white/[0.06] bg-white/[0.02]'
          }`}
        >
          {sessionId ? (
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-400 leading-none mb-1">Document Ready</p>
                <p className="text-[11px] text-slate-400 truncate" title={fileName}>{fileName}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <FileUp size={14} className="text-slate-500 flex-shrink-0" />
              <p className="text-xs text-slate-500">No document loaded</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">Features</p>
        {NAV.map(({ id, icon: Icon, label, desc }) => (
          <motion.button
            key={id}
            onClick={() => setMode(id)}
            whileTap={{ scale: 0.97 }}
            disabled={!sessionId}
            className={`sidebar-btn ${mode === id && sessionId ? 'active' : ''} ${!sessionId ? 'opacity-35 cursor-not-allowed' : ''}`}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 ${
              mode === id && sessionId ? 'bg-brand-500/25' : 'bg-white/[0.04]'
            }`}>
              <Icon size={14} className={mode === id && sessionId ? 'text-brand-400' : 'text-slate-500'} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[13px] leading-none mb-0.5">{label}</span>
              <span className="block text-[10px] text-slate-600 font-normal">{desc}</span>
            </span>
            {mode === id && sessionId && (
              <ChevronRight size={12} className="text-brand-500/60" />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/[0.05] px-3 py-3 space-y-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={clearChat}
          disabled={!sessionId}
          className={`sidebar-btn text-red-400/80 hover:text-red-400 hover:bg-red-500/8 ${!sessionId ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
            <Trash2 size={13} />
          </span>
          Clear Chat
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setDark(d => !d)}
          className="sidebar-btn"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
            {dark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-slate-400" />}
          </span>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </motion.button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.04]">
        <p className="text-[10px] text-slate-700 text-center font-medium tracking-wide">
          Built with ❤️ using LLMs
        </p>
      </div>
    </aside>
  )
}
