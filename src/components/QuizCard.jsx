import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

const LABELS = ['A', 'B', 'C', 'D']

export default function QuizCard({ question, index }) {
  const [selected, setSelected] = useState(null)

  // Normalize question shape from various API response formats
  const q = question.question || question.q || `Question ${index + 1}`
  const options = question.options || question.choices || []
  const correct = question.correct_answer ?? question.answer ?? question.correct ?? 0

  const correctIndex = typeof correct === 'number'
    ? correct
    : options.findIndex(o => o === correct)

  const handleSelect = (i) => {
    if (selected !== null) return
    setSelected(i)
  }

  const getOptionClass = (i) => {
    if (selected === null) return 'default'
    if (i === correctIndex) return 'correct'
    if (i === selected && selected !== correctIndex) return 'wrong'
    return 'revealed'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-white/[0.07] bg-slate-800/40 p-4"
    >
      {/* Question */}
      <div className="flex items-start gap-2.5 mb-4">
        <span className="flex-shrink-0 h-6 w-6 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-[11px] font-bold text-brand-400">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-slate-200 leading-relaxed">{q}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => {
          const cls = getOptionClass(i)
          return (
            <motion.button
              key={i}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              className={`quiz-option ${cls}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-[11px] font-bold
                  ${cls === 'correct' ? 'bg-green-500/20 text-green-400'
                    : cls === 'wrong' ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/[0.05] text-slate-500'}`}>
                  {LABELS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                <AnimatePresence>
                  {selected !== null && i === correctIndex && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 size={15} className="text-green-400" />
                    </motion.span>
                  )}
                  {selected === i && i !== correctIndex && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <XCircle size={15} className="text-red-400" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Result message */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <p className={`text-xs font-medium px-3 py-2 rounded-lg ${
              selected === correctIndex
                ? 'text-green-400 bg-green-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}>
              {selected === correctIndex
                ? '✓ Correct! Well done.'
                : `✗ Not quite. The correct answer is ${LABELS[correctIndex]}.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
