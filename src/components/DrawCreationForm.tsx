'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDraw } from '@/app/actions'
import { Gift, X, Plus, Sparkles, Copy, Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export default function DrawCreationForm() {
  const [title, setTitle] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [currentName, setCurrentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const addName = () => {
    const trimmed = currentName.trim()
    if (!trimmed) return
    if (names.includes(trimmed)) {
      setError(`"${trimmed}" zaten eklendi! İsimler benzersiz olmalıdır.`)
      return
    }
    setNames([...names, trimmed])
    setCurrentName('')
    setError(null)
  }

  const removeName = (nameToRemove: string) => {
    setNames(names.filter(n => n !== nameToRemove))
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addName()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Lütfen çekilişinize bir isim verin!')
      return
    }
    if (names.length < 2) {
      setError('Çekiliş yapmak için en az 2 kişiye ihtiyacınız var!')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('names', JSON.stringify(names))

    const result = await createDraw(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result.slug) {
      setCreatedSlug(result.slug)
    }
  }

  const handleCopy = () => {
    if (typeof window !== 'undefined' && createdSlug) {
      const shareUrl = `${window.location.origin}/draw/${createdSlug}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareUrl = typeof window !== 'undefined' && createdSlug 
    ? `${window.location.origin}/draw/${createdSlug}`
    : ''

  if (createdSlug) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
          Tebrikler! 🎉
        </h2>
        
        <p className="text-slate-600 font-medium text-lg mb-8 max-w-md mx-auto">
          Çekilişiniz başarıyla oluşturuldu! Aşağıdaki linki katılımcılarla paylaşıp çekilişi başlatabilirsin:
        </p>

        <div className="w-full flex items-center gap-2 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl mb-8 relative overflow-hidden">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2 py-1 outline-none text-slate-700 font-semibold text-sm sm:text-base select-all"
          />
          <button
            onClick={handleCopy}
            className={cn(
              "px-4 py-3 rounded-xl font-bold text-white shadow transition-all flex items-center gap-2 active:scale-95",
              copied ? "bg-emerald-500" : "bg-purple-600 hover:bg-purple-500"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopyala</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => router.push(`/draw/${createdSlug}`)}
          className="w-full py-5 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 active:scale-[0.98] rounded-2xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-all"
        >
          <span>Lobiyi Görüntüle</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 bg-gradient-to-tr from-rose-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30"
        >
          <Gift className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mb-2">
          Çekiliş Oluştur
        </h1>
        <p className="text-slate-600 font-medium">Arkadaşlarınızı ekleyin ve sihrin gerçekleşmesine izin verin!</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
            Çekiliş Adı
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Ofis Partisi 2026 🎄"
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-400/20 outline-none transition-all text-lg"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
            Katılımcı Ekle
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="name"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Bir isim girin..."
              className="flex-1 px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all text-lg"
            />
            <button
              type="button"
              onClick={addName}
              className="px-6 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Ekle</span>
            </button>
          </div>
        </div>

        <div className="min-h-[100px] p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <AnimatePresence>
            {names.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center text-slate-400 font-medium italic py-8"
              >
                Henüz katılımcı eklenmedi. En az iki kişi ekleyin!
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {names.map((name) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm"
                  >
                    <span className="font-semibold text-slate-700">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeName(name)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || names.length < 2}
          className={cn(
            "w-full py-5 rounded-2xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden",
            isSubmitting || names.length < 2
              ? "bg-slate-300 shadow-none cursor-not-allowed"
              : "bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 active:scale-[0.98] hover:shadow-Rose-500/25"
          )}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Sihir Yaratılıyor...</span>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Çekilişi Oluştur
            </>
          )}
        </button>
      </form>
    </div>
  )
}
