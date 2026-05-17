import DrawCreationForm from '@/components/DrawCreationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çekiliş Oluştur',
  description: 'Arkadaşlarınız ve aileniz için adil, rastgele ve sihirli bir yılbaşı çekilişi oluşturun.',
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-snow-pattern opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <DrawCreationForm />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-white/50 text-sm z-10">
        <p>Sihirle hazırlandı ✨</p>
      </footer>
    </main>
  )
}
