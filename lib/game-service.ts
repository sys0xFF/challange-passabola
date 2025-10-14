// Serviço para gerenciar eventos de jogo no estilo Nintendo Switch
import { database } from './firebase';
import { ref, set, get, update, onValue, off, remove } from 'firebase/database';
import { MovementPreset } from './band-service';

export interface GameRound {
  movement: string;
  duration: number; // em segundos
  axis: 'X' | 'Y' | 'Z';
  preset?: MovementPreset;
}

export interface GameBand {
  bandId: string;
  userId: string;
  userName: string;
  userEmail: string;
  points: number;
  color: 'blue' | 'red';
}

export type GameStatus = 
  | 'waiting'
  | 'round1_intro'
  | 'round1_countdown'
  | 'round1_active'
  | 'round2_intro'
  | 'round2_countdown'
  | 'round2_active'
  | 'finished';

export interface GameEvent {
  id: string;
  status: GameStatus;
  createdAt: string;
  rounds: GameRound[];
  currentRound: number; // 0 ou 1
  bands: {
    band010?: GameBand;
    band020?: GameBand;
  };
  winner?: 'band010' | 'band020' | 'tie';
  round1Winner?: 'band010' | 'band020' | 'tie';
  round2Winner?: 'band010' | 'band020' | 'tie';
}

/**
 * Criar novo evento de jogo
 */
export async function createGameEvent(
  rounds: GameRound[],
  band010: Omit<GameBand, 'points' | 'color'>,
  band020: Omit<GameBand, 'points' | 'color'>
): Promise<{ success: boolean; eventId?: string; error?: any }> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    
    // Verificar se já existe um evento ativo
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const existingEvent = snapshot.val() as GameEvent;
      if (existingEvent.status !== 'finished' && existingEvent.status !== 'waiting') {
        return { success: false, error: 'Já existe um evento ativo' };
      }
    }
    
    const eventId = Date.now().toString();
    const gameEvent: GameEvent = {
      id: eventId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      rounds,
      currentRound: 0,
      bands: {
        band010: {
          ...band010,
          points: 0,
          color: 'blue'
        },
        band020: {
          ...band020,
          points: 0,
          color: 'red'
        }
      }
    };
    
    await set(eventRef, gameEvent);
    
    return { success: true, eventId };
  } catch (error) {
    console.error('Error creating game event:', error);
    return { success: false, error };
  }
}

/**
 * Atualizar status do evento
 */
export async function updateGameStatus(status: GameStatus): Promise<boolean> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    await update(eventRef, { status });
    return true;
  } catch (error) {
    console.error('Error updating game status:', error);
    return false;
  }
}

/**
 * Atualizar round atual
 */
export async function updateCurrentRound(roundIndex: number): Promise<boolean> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    await update(eventRef, { currentRound: roundIndex });
    return true;
  } catch (error) {
    console.error('Error updating current round:', error);
    return false;
  }
}

/**
 * Atualizar pontos de uma pulseira no evento
 */
export async function updateBandPoints(
  bandId: 'band010' | 'band020',
  points: number
): Promise<boolean> {
  try {
    const eventRef = ref(database, `gameEvents/currentEvent/bands/${bandId}`);
    await update(eventRef, { points });
    return true;
  } catch (error) {
    console.error('Error updating band points:', error);
    return false;
  }
}

/**
 * Definir vencedor do round
 */
export async function setRoundWinner(
  roundIndex: number,
  winner: 'band010' | 'band020' | 'tie'
): Promise<boolean> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    const field = roundIndex === 0 ? 'round1Winner' : 'round2Winner';
    await update(eventRef, { [field]: winner });
    return true;
  } catch (error) {
    console.error('Error setting round winner:', error);
    return false;
  }
}

/**
 * Definir vencedor final
 */
export async function setGameWinner(
  winner: 'band010' | 'band020' | 'tie'
): Promise<boolean> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    await update(eventRef, { 
      winner,
      status: 'finished'
    });
    return true;
  } catch (error) {
    console.error('Error setting game winner:', error);
    return false;
  }
}

/**
 * Buscar evento atual
 */
export async function getCurrentGameEvent(): Promise<GameEvent | null> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    const snapshot = await get(eventRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return snapshot.val() as GameEvent;
  } catch (error) {
    console.error('Error fetching game event:', error);
    return null;
  }
}

/**
 * Escutar mudanças no evento em tempo real
 */
export function subscribeToGameEvent(
  callback: (event: GameEvent | null) => void
): () => void {
  const eventRef = ref(database, 'gameEvents/currentEvent');
  
  const unsubscribe = onValue(eventRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as GameEvent);
    } else {
      callback(null);
    }
  });
  
  return () => off(eventRef, 'value', unsubscribe);
}

/**
 * Limpar evento atual
 */
export async function clearGameEvent(): Promise<boolean> {
  try {
    const eventRef = ref(database, 'gameEvents/currentEvent');
    await remove(eventRef);
    return true;
  } catch (error) {
    console.error('Error clearing game event:', error);
    return false;
  }
}

/**
 * Verificar se há evento ativo
 */
export async function hasActiveGameEvent(): Promise<boolean> {
  try {
    const event = await getCurrentGameEvent();
    return event !== null && event.status !== 'finished' && event.status !== 'waiting';
  } catch (error) {
    console.error('Error checking active game event:', error);
    return false;
  }
}
