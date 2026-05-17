'use server'

import prisma from '@/lib/prisma'
import { generateMatches } from '@/lib/shuffle'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

export async function createDraw(formData: FormData) {
  const title = formData.get('title') as string
  const namesString = formData.get('names') as string
  
  if (!title || !namesString) {
    return { error: 'Başlık ve isimler gereklidir' }
  }

  const names = JSON.parse(namesString) as string[]
  
  if (names.length < 2) {
    return { error: 'En az 2 katılımcı gereklidir' }
  }

  // Deduplicate names
  const uniqueNames = Array.from(new Set(names))
  if (uniqueNames.length !== names.length) {
    return { error: 'Tüm katılımcı isimleri benzersiz olmalıdır' }
  }

  try {
    const participantsInput = uniqueNames.map(name => ({ name }))
    const matches = generateMatches(participantsInput)

    const slug = uuidv4().substring(0, 8)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    // We need to generate IDs for all participants first to map assignedToId
    const participantData = uniqueNames.map(name => ({
      id: uuidv4(),
      name,
    }))

    const idMap = new Map(participantData.map(p => [p.name, p.id]))

    const finalParticipants = matches.map(match => {
      const giverId = idMap.get(match.giverName)!
      const receiverId = idMap.get(match.receiverName)!

      return {
        id: giverId,
        name: match.giverName,
        assignedToId: receiverId,
        targetName: match.receiverName,
        hasDrawn: false,
      }
    })

    const draw = await prisma.draw.create({
      data: {
        title,
        slug,
        expiresAt,
        participants: {
          create: finalParticipants
        }
      }
    })

    return { slug: draw.slug }
  } catch (error: any) {
    console.error('Error creating draw:', error)
    return { error: error.message || 'Çekiliş oluşturulamadı' }
  }
}

export async function revealTarget(participantId: string, drawId: string) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { draw: true }
    })

    if (!participant || participant.drawId !== drawId) {
      return { error: 'Katılımcı bulunamadı' }
    }

    // Mark as drawn if not already
    if (!participant.hasDrawn) {
      await prisma.participant.update({
        where: { id: participantId },
        data: { hasDrawn: true },
      })
      revalidatePath(`/draw/${participant.draw.slug}`)
    }

    return { targetName: participant.targetName }
  } catch (error) {
    console.error('Error revealing target:', error)
    return { error: 'Hedef gösterilemedi' }
  }
}
