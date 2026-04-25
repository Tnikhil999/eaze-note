import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar.jsx'
import Chat from './components/Chat.jsx'
import UploadBox from './components/UploadBox.jsx'
import { uploadDocument } from './lib/api.js'

export default function App() {
  const [dark, setDark] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [mode, setMode] = useState('ask') // 'ask' | 'summary' | 'quiz'
  const [messages, setMessages] = useState([])

  const handleUpload = useCallback(async (file) => {
    setUploading(true)
    setUploadError(null)
    try {
      const res = await uploadDocument(file)
      const sid = res.data?.session_id || res.data?.sessionId || 'session-' + Date.now()
      setSessionId(sid)
      setFileName(file.name)
      setMessages([])
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])
  }, [])

  const updateLastAiMessage = useCallback((patch) => {
    setMessages(prev => {
      const copy = [...prev]
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'ai') { copy[i] = { ...copy[i], ...patch }; break }
      }
      return copy
    })
  }, [])

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="noise-overlay flex h-screen w-screen overflow-hidden bg-slate-950 text-white font-sans">

        {/* Ambient background blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/8 blur-3xl animate-blob" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-violet-500/6 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-brand-600/5 blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
        </div>

        {/* Sidebar */}
        <Sidebar
          dark={dark}
          setDark={setDark}
          mode={mode}
          setMode={setMode}
          fileName={fileName}
          sessionId={sessionId}
          clearChat={clearChat}
        />

        {/* Main */}
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {!sessionId ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-1 items-center justify-center p-8"
              >
                <UploadBox
                  onUpload={handleUpload}
                  uploading={uploading}
                  error={uploadError}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <Chat
                  mode={mode}
                  setMode={setMode}
                  sessionId={sessionId}
                  fileName={fileName}
                  messages={messages}
                  addMessage={addMessage}
                  updateLastAiMessage={updateLastAiMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
