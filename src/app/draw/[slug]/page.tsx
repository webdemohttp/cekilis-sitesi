import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ParticipantSelector from '@/components/ParticipantSelector'
import { PartyPopper } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DrawLobbyPage({ params }: PageProps) {
  const { slug } = await params
  
  const draw = await prisma.draw.findUnique({
    where: { slug },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          hasDrawn: true,
        },
        orderBy: {
          id: 'asc'
        }
      }
    }
  })

  if (!draw) {
    notFound()
  }

  const allDrawn = draw.participants.every((p: { hasDrawn: boolean }) => p.hasDrawn)

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-snow-pattern opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400 mb-4">
            {draw.title}
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium">
            Gizli Noel Baba Eşleşmesi
          </div>
        </div>

        <ParticipantSelector 
          participants={draw.participants} 
          drawId={draw.id} 
          initialAllDrawn={allDrawn} 
        />
      </div>
    </main>
  )
}
