export interface ParticipantInput {
  name: string;
}

export interface Match {
  giverName: string;
  receiverName: string;
}

/**
 * Shuffles an array randomly using Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Generates a valid Secret Santa matchmaking.
 * It creates a single closed loop containing all participants.
 * This guarantees:
 * 1. Derangement: No one is assigned to themselves.
 * 2. Everyone gives exactly once and receives exactly once.
 * 
 * Throws an error if the array has fewer than 2 elements.
 */
export function generateMatches(participants: ParticipantInput[]): Match[] {
  if (participants.length < 2) {
    throw new Error('At least 2 participants are required for Secret Santa.');
  }

  const shuffled = shuffleArray(participants);
  const matches: Match[] = [];

  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i];
    // Next person in the shuffled array, or wrap around to the first
    const receiver = shuffled[(i + 1) % shuffled.length];
    
    matches.push({
      giverName: giver.name,
      receiverName: receiver.name
    });
  }

  return matches;
}
