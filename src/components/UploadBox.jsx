import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, AlertCircle, Sparkles, FileType } from 'lucide-react'

export default function UploadBox({ onUpload, uploading, error }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const validate = (file) => {
    if (!file) return 'No file selected.'
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'txt'].includes(ext)) return 'Only .pdf and .txt files are supported.'
    if (file.size > 20 * 1024 * 1024) return 'File size must be under 20 MB.'
    return null
  }

  const handleFile = useCallback((file) => {
    const err = validate(file)
    if (err) { alert(err); return }
    onUpload(file)
  }, [onUpload])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onChange = (e) => { if (e.target.files[0]) handleFile(e.target.files[0]) }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6 tracking-wide uppercase">
          <Sparkles size={11} />
          AI Document Assistant
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          Chat with your<br />
          <span className="text-gradient">documents</span>
        </h1>
        <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mx-auto">
          Upload a PDF or text file. Ask questions, get summaries, and test your knowledge instantly.
        </p>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${dragging
            ? 'border-brand-500/70 bg-brand-500/8 scale-[1.01]'
            : 'border-white/[0.1] bg-white/[0.02] hover:border-brand-500/40 hover:bg-brand-500/5'
          }
          ${uploading ? 'cursor-wait pointer-events-none' : ''}
        `}
      >
        {/* Glow */}
        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/8 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative z-10">
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                    <Loader2 size={28} className="text-brand-400 animate-spin-slow" />
                  </div>
                </div>
                <p className="text-white font-semibold text-[15px] mb-1.5">Uploading document…</p>
                <p className="text-slate-500 text-sm">Processing your file, please wait</p>
                {/* Progress bar */}
                <div className="mt-5 w-48 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative mb-5 inline-flex">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${dragging ? 'bg-brand-500/25 border-brand-500/30' : 'bg-slate-800/80 border-white/[0.08]'} border`}>
                    <Upload size={26} className={dragging ? 'text-brand-400' : 'text-slate-400'} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-slate-700 border border-white/[0.06] flex items-center justify-center">
                    <FileType size={11} className="text-slate-400" />
                  </div>
                </div>
                <p className="text-white font-semibold text-[15px] mb-2">
                  {dragging ? 'Release to upload' : 'Drop your file here'}
                </p>
                <p className="text-slate-500 text-sm mb-5">
                  or <span className="text-brand-400 font-medium">browse to choose</span>
                </p>
                <div className="flex items-center justify-center gap-3">
                  {['PDF', 'TXT'].map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/[0.07] text-slate-400 text-xs font-mono font-medium">
                      <FileText size={10} />
                      .{t.toLowerCase()}
                    </span>
                  ))}
                  <span className="text-slate-600 text-xs">· Max 20 MB</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input ref={inputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={onChange} />
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25"
          >
            <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {['💬 Ask questions', '📋 Auto-summary', '🧠 Quiz yourself', '🔍 Source citations'].map(f => (
          <span key={f} className="text-xs text-slate-500 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">{f}</span>
        ))}
      </motion.div>
    </div>
  )
}
