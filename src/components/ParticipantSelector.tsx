'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { revealTarget } from '@/app/actions'
import RaffleBagAnimation from './RaffleBagAnimation'
import { UserCheck, Sparkles, CheckCircle2, PartyPopper } from 'lucide-react'

interface Participant {
  id: string
  name: string
  hasDrawn: boolean
}

interface ParticipantSelectorProps {
  participants: Participant[]
  drawId: string
  initialAllDrawn: boolean
}

export default function ParticipantSelector({ participants, drawId, initialAllDrawn }: ParticipantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [targetName, setTargetName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedParticipant = participants.find(p => p.id === selectedId)

  const handleReveal = async () => {
    if (!selectedId) return
    setIsRevealing(true)
    setError(null)

    // Start fetching while animating
    const result = await revealTarget(selectedId, drawId)
    
    if (result.error) {
      setError(result.error)
      setIsRevealing(false)
    } else {
      setTargetName(result.targetName || null)
    }
  }

  const handleAnimationComplete = () => {
    // Animation is done. Nothing extra needed unless we want to trigger confetti
  }

  if (targetName && isRevealing) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        <RaffleBagAnimation 
          isRevealing={isRevealing} 
          targetName={targetName} 
          onShakeComplete={handleAnimationComplete} 
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    )
  }

  if (initialAllDrawn) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center shadow-2xl">
        <PartyPopper className="w-24 h-24 text-rose-400 mx-auto mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-white mb-4">Çekiliş Tamamlandı!</h2>
        <p className="text-lg text-white/80">
          Tüm gizli zarflar açıldı. Sırrınızı saklayın ve keyifli hediyeler verin!
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Kimsiniz?</h2>
        <p className="text-white/70">Kime hediye alacağınızı keşfetmek için adınızı seçin!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (!p.hasDrawn) setSelectedId(p.id)
            }}
            disabled={p.hasDrawn}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2
              ${p.hasDrawn 
                ? 'bg-slate-800/50 border-slate-700/50 cursor-not-allowed opacity-60' 
                : selectedId === p.id
                  ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer'}
            `}
          >
            {p.hasDrawn ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedId === p.id ? 'bg-white' : 'bg-white/20'}`}>
                <UserCheck className={`w-4 h-4 ${selectedId === p.id ? 'text-purple-600' : 'text-white'}`} />
              </div>
            )}
            <span className={`font-semibold text-center ${selectedId === p.id ? 'text-white' : 'text-white/90'}`}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedParticipant && !selectedParticipant.hasDrawn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20"
          >
            <p className="text-white text-lg">
              <span className="font-bold text-purple-300">{selectedParticipant.name}</span> olduğunuzu onaylıyor musunuz?
            </p>
            <button
              onClick={handleReveal}
              disabled={isRevealing}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 rounded-full font-bold text-lg text-white shadow-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              Torbayı Salla & Keşfet!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
