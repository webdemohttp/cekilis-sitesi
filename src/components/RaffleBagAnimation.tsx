'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Gift, MailOpen } from 'lucide-react'

interface RaffleBagAnimationProps {
  onShakeComplete: () => void;
  targetName: string | null;
  isRevealing: boolean;
}

export default function RaffleBagAnimation({ onShakeComplete, targetName, isRevealing }: RaffleBagAnimationProps) {
  const [shaking, setShaking] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isRevealing) {
      setShaking(true)
      const timer = setTimeout(() => {
        setShaking(false)
        setRevealed(true)
        onShakeComplete()
      }, 1800) // 1.8 seconds shake

      return () => clearTimeout(timer)
    }
  }, [isRevealing, onShakeComplete])

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      <AnimatePresence>
        {!revealed ? (
          <motion.div
            key="bag"
            animate={
              shaking
                ? {
                    rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
                    y: [0, -10, 10, -10, 10, -5, 5, 0],
                  }
                : { y: [0, -5, 0] }
            }
            transition={
              shaking
                ? { duration: 1.8, ease: "easeInOut" }
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
            className="w-48 h-56 bg-red-600 rounded-3xl relative shadow-2xl flex flex-col items-center justify-center border-4 border-red-700"
          >
            {/* Bag Details */}
            <div className="absolute -top-4 w-32 h-8 bg-red-700 rounded-full" />
            <div className="absolute top-8 w-full border-t-4 border-dashed border-red-400/50" />
            <Gift className="w-20 h-20 text-white mt-4 opacity-80" />
            <div className="absolute bottom-4 text-white/50 font-bold tracking-widest text-sm">GİZLİ NOEL BABA</div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ scale: 0.5, y: 100, rotateX: 90, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 12,
              duration: 1
            }}
            className="w-full h-80 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-2xl p-8 flex flex-col items-center justify-center border-2 border-amber-200 relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-300 opacity-50 m-4 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-300 opacity-50 m-4 rounded-br-xl" />
            
            <MailOpen className="w-16 h-16 text-amber-600 mb-6" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <h3 className="text-xl font-medium text-amber-800 mb-2 font-serif italic">
                Hediye alacağınız kişi:
              </h3>
              <div className="text-4xl font-black text-rose-600 tracking-tight uppercase">
                {targetName || '???'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
