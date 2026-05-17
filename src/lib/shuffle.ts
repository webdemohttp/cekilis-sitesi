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
 * It uses a true random derangement search algorithm with an automatic retry mechanism.
 * This guarantees:
 * 1. Derangement: No one is assigned to themselves (Giver !== Receiver).
 * 2. Everyone gives exactly once and receives exactly once.
 * 3. True randomized matchmaking rather than a simple sequential circle loop.
 * 4. Automatic retry loop if a self-matching collision occurs.
 * 
 * Throws an error if the array has fewer than 2 elements.
 */
export function generateMatches(participants: ParticipantInput[]): Match[] {
  if (participants.length < 2) {
    throw new Error('At least 2 participants are required for Secret Santa.');
  }

  const original = [...participants];
  let shuffled: ParticipantInput[] = [];
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 5000; // Safety safeguard to prevent any infinite loops

  while (!isValid && attempts < maxAttempts) {
    attempts++;
    shuffled = shuffleArray(original);
    
    // Check if it's a valid derangement
    isValid = true;
    for (let i = 0; i < original.length; i++) {
      if (original[i].name === shuffled[i].name) {
        isValid = false;
        break;
      }
    }
  }

  if (!isValid) {
    throw new Error('Failed to generate a valid randomized matchmaking after multiple attempts.');
  }

  const matches: Match[] = [];
  for (let i = 0; i < original.length; i++) {
    matches.push({
      giverName: original[i].name,
      receiverName: shuffled[i].name
    });
  }

  return matches;
}
