import { database } from './firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import type { BandLink } from './band-service';

export interface TeamRegistration {
  type: 'team';
  userId?: string; // ID do usuário autenticado
  teamData: {
    nomeTime: string;
    nomeCapitao: string;
  };
  captainData: {
    nomeCompleto: string;
    idade: string;
    email: string;
    telefone: string;
    cidadeBairro: string;
    posicao: string;
    jaParticipou: string;
  };
  players: Array<{
    id: number;
    nomeCompleto: string;
    idade: string;
    email: string;
    telefone: string;
    cidadeBairro: string;
    posicao: string;
    jaParticipou: string;
  }>;
  preferences: {
    acceptTerms: boolean;
    wantNotifications: boolean;
  };
  registrationDate: string;
}

export interface IndividualRegistration {
  type: 'individual';
  userId?: string; // ID do usuário autenticado
  captainData: {
    nomeCompleto: string;
    idade: string;
    email: string;
    telefone: string;
    cidadeBairro: string;
    posicao: string;
    jaParticipou: string;
  };
  preferences: {
    acceptTerms: boolean;
    wantNotifications: boolean;
  };
  registrationDate: string;
}

export async function saveTeamRegistration(registrationData: Omit<TeamRegistration, 'registrationDate'>) {
  try {
    const teamsRef = ref(database, 'Teams');
    const newTeamRef = push(teamsRef);
    
    const teamRegistration: TeamRegistration = {
      ...registrationData,
      registrationDate: new Date().toISOString()
    };

    await set(newTeamRef, teamRegistration);
    
    console.log('Team registration saved successfully!');
    return { success: true, id: newTeamRef.key };
  } catch (error) {
    console.error('Error saving team registration:', error);
    return { success: false, error };
  }
}

export async function saveIndividualRegistration(registrationData: Omit<IndividualRegistration, 'registrationDate'>) {
  try {
    const individualsRef = ref(database, 'Individuals');
    const newIndividualRef = push(individualsRef);
    
    const individualRegistration: IndividualRegistration = {
      ...registrationData,
      registrationDate: new Date().toISOString()
    };

    await set(newIndividualRef, individualRegistration);
    
    console.log('Individual registration saved successfully!');
    return { success: true, id: newIndividualRef.key };
  } catch (error) {
    console.error('Error saving individual registration:', error);
    return { success: false, error };
  }
}

export interface VolunteerRegistration {
  type: 'volunteer';
  userId?: string; // ID do usuário autenticado
  formData: {
    nomeCompleto: string;
    idade: string;
    email: string;
    telefone: string;
    cidadeBairro: string;
    profissao: string;
    experienciaAnterior: string;
    motivacao: string;
    disponibilidadeDias: string[];
    disponibilidadeHorarios: string[];
    temTransporte: string;
    referencias: string;
    antecedentes: string;
    observacoes: string;
  };
  selectedAreas: string[];
  preferences: {
    acceptTerms: boolean;
    wantNotifications: boolean;
  };
  registrationDate: string;
}

export async function saveVolunteerRegistration(registrationData: Omit<VolunteerRegistration, 'registrationDate'>) {
  try {
    const volunteersRef = ref(database, 'volunteers');
    const newVolunteerRef = push(volunteersRef);
    
    const volunteerRegistration: VolunteerRegistration = {
      ...registrationData,
      registrationDate: new Date().toISOString()
    };

    await set(newVolunteerRef, volunteerRegistration);
    
    console.log('Volunteer registration saved successfully!');
    return { success: true, id: newVolunteerRef.key };
  } catch (error) {
    console.error('Error saving volunteer registration:', error);
    return { success: false, error };
  }
}

export interface DonationData {
  type: 'donation';
  userId?: string; // ID do usuário autenticado
  donationType: 'anonymous' | 'identified';
  amount: number;
  paymentMethod: 'pix' | 'card';
  donorData?: {
    nomeCompleto: string;
    email: string;
    telefone: string;
    cpf: string;
    receberRecibo: boolean;
    receberNoticias: boolean;
  };
  cardData?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
  donationDate: string;
}

export async function saveDonation(donationData: Omit<DonationData, 'donationDate'>) {
  try {
    const donationsRef = ref(database, 'donors');
    const newDonationRef = push(donationsRef);
    
    const donation: DonationData = {
      ...donationData,
      donationDate: new Date().toISOString()
    };

    await set(newDonationRef, donation);
    
    console.log('Donation saved successfully!');
    return { success: true, id: newDonationRef.key };
  } catch (error) {
    console.error('Error saving donation:', error);
    return { success: false, error };
  }
}

export interface PurchaseData {
  type: 'purchase';
  userId?: string; // ID do usuário autenticado
  customerData: {
    nomeCompleto: string;
    email: string;
    telefone: string;
    cpf: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    receberNoticias: boolean;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    image?: string;
  }>;
  paymentMethod: 'pix' | 'card';
  cardData?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  purchaseDate: string;
  orderId: string;
}

export async function savePurchase(purchaseData: Omit<PurchaseData, 'purchaseDate' | 'orderId'>) {
  try {
    const purchasesRef = ref(database, 'purchases');
    const newPurchaseRef = push(purchasesRef);
    
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Clean up undefined values from items (Firebase doesn't accept undefined)
    const cleanedItems = purchaseData.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      ...(item.selectedSize && { selectedSize: item.selectedSize }),
      ...(item.image && { image: item.image }),
    }));
    
    const purchase: PurchaseData = {
      ...purchaseData,
      items: cleanedItems,
      purchaseDate: new Date().toISOString(),
      orderId
    };

    await set(newPurchaseRef, purchase);
    
    console.log('Purchase saved successfully!');
    return { success: true, id: newPurchaseRef.key, orderId };
  } catch (error) {
    console.error('Error saving purchase:', error);
    return { success: false, error };
  }
}

export interface GameTeam {
  id: string;
  name: string;
  type: 'registered' | 'auto-generated';
  registeredTeamId?: string; // ID do time registrado
  players: Array<{
    id: string;
    name: string;
    position: string;
    isFromIndividual?: boolean;
    individualId?: string;
  }>;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  team1: GameTeam | null;
  team2: GameTeam | null;
  winner?: string;
  score?: {
    team1: number;
    team2: number;
  };
  status: 'pending' | 'in-progress' | 'completed';
  scheduledTime?: string;
}

export interface Tournament {
  id: string;
  name: string;
  maxTeams: number;
  isCopaPassaBola: boolean;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  isPaid: boolean;
  entryFee?: number;
  description?: string;
  status: 'draft' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';
  teams: GameTeam[];
  bracket: Match[];
  createdDate: string;
  createdBy: string;
}

export interface Game {
  id: string;
  tournamentId: string;
  tournamentName: string;
  title: string;
  phase: string; // Ex: "Quartas de Final", "Semifinal", "Final"
  team1: string;
  team2: string;
  date: string;
  time: string;
  location: string;
  stadium: string;
  ticketTypes: TicketType[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  result?: {
    team1Score: number;
    team2Score: number;
    winner: string;
  };
  createdDate: string;
  createdBy: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldQuantity: number;
  benefits: string[];
}

export interface TicketPurchase {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  createdAt: string; // Adicionar este campo para compatibilidade
  status: 'confirmed' | 'used' | 'cancelled';
  qrCode: string;
  purchaseDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estadoCivil?: string;
  points: number;
  tickets: TicketPurchase[];
  registrations: {
    teams: string[];
    individuals: string[];
    volunteers: string[];
  };
  createdAt: string;
}

export async function saveTournament(tournamentData: Omit<Tournament, 'id' | 'createdDate' | 'teams' | 'bracket'>) {
  try {
    const tournamentsRef = ref(database, 'tournaments');
    const newTournamentRef = push(tournamentsRef);
    
    const tournament: Tournament = {
      ...tournamentData,
      id: newTournamentRef.key || '',
      teams: [],
      bracket: [],
      createdDate: new Date().toISOString()
    };

    await set(newTournamentRef, tournament);
    
    console.log('Tournament saved successfully!');
    return { success: true, id: newTournamentRef.key };
  } catch (error) {
    console.error('Error saving tournament:', error);
    return { success: false, error };
  }
}

export async function saveGame(gameData: Omit<Game, 'id' | 'createdDate'>) {
  try {
    const gamesRef = ref(database, 'games');
    const newGameRef = push(gamesRef);
    
    const game: Game = {
      ...gameData,
      id: newGameRef.key || '',
      createdDate: new Date().toISOString()
    };

    await set(newGameRef, game);
    
    console.log('Game saved successfully!');
    return { success: true, id: newGameRef.key };
  } catch (error) {
    console.error('Error saving game:', error);
    return { success: false, error };
  }
}

export async function saveTicketPurchase(ticketData: Omit<TicketPurchase, 'id' | 'purchaseDate' | 'qrCode' | 'createdAt'>) {
  try {
    const ticketsRef = ref(database, 'ticketPurchases');
    const newTicketRef = push(ticketsRef);
    
    // Gerar QR Code único
    const qrCode = `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const currentDate = new Date().toISOString();
    
    const ticket: TicketPurchase = {
      ...ticketData,
      id: newTicketRef.key || '',
      purchaseDate: currentDate,
      createdAt: currentDate,
      qrCode
    };

    await set(newTicketRef, ticket);
    
    // Atualizar pontos do usuário (10 pontos por ingresso comprado)
    await updateUserPoints(ticketData.userId, ticketData.quantity * 10);
    
    console.log('Ticket purchase saved successfully!');
    return { success: true, id: newTicketRef.key, qrCode };
  } catch (error) {
    console.error('Error saving ticket purchase:', error);
    return { success: false, error };
  }
}

export async function updateUserPoints(userId: string, pointsToAdd: number) {
  try {
    const { get } = await import('firebase/database');
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    
    if (userData) {
      const currentPoints = userData.points || 0;
      await set(ref(database, `users/${userId}/points`), currentPoints + pointsToAdd);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user points:', error);
    return { success: false, error };
  }
}

export async function saveUserProfile(userData: Omit<UserProfile, 'id' | 'createdAt'>) {
  try {
    const usersRef = ref(database, 'users');
    const newUserRef = push(usersRef);
    
    const user: UserProfile = {
      ...userData,
      id: newUserRef.key || '',
      points: userData.points || 0,
      tickets: userData.tickets || [],
      registrations: userData.registrations || { teams: [], individuals: [], volunteers: [] },
      createdAt: new Date().toISOString()
    };

    await set(newUserRef, user);
    
    console.log('User profile saved successfully!');
    return { success: true, id: newUserRef.key };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error };
  }
}

export async function updateTournament(tournamentId: string, updates: Partial<Tournament>) {
  try {
    const tournamentRef = ref(database, `tournaments/${tournamentId}`);
    
    // Primeiro, buscar os dados existentes
    const { get } = await import('firebase/database');
    const snapshot = await get(tournamentRef);
    const existingData = snapshot.val();
    
    if (!existingData) {
      throw new Error('Tournament not found');
    }
    
    // Mesclar os dados existentes com as atualizações
    const updatedTournament = {
      ...existingData,
      ...updates
    };
    
    await set(tournamentRef, updatedTournament);
    
    console.log('Tournament updated successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error updating tournament:', error);
    return { success: false, error };
  }
}

export async function updateMatchAndAdvanceWinners(tournamentId: string, matchId: string, updates: Partial<Match>) {
  try {
    console.log('=== updateMatchAndAdvanceWinners START ===');
    console.log('Tournament ID:', tournamentId);
    console.log('Match ID:', matchId);
    console.log('Updates:', updates);
    
    // Primeiro, buscar o torneio completo
    const { get } = await import('firebase/database');
    const tournamentRef = ref(database, `tournaments/${tournamentId}`);
    const snapshot = await get(tournamentRef);
    const tournament = snapshot.val();
    
    if (!tournament || !tournament.bracket) {
      throw new Error('Tournament or bracket not found');
    }
    
    console.log('Current bracket before update:', JSON.stringify(tournament.bracket.map((m: Match) => ({
      id: m.id,
      round: m.round,
      position: m.position,
      team1: m.team1?.name || 'null',
      team2: m.team2?.name || 'null',
      winner: m.winner || 'none'
    })), null, 2));
    
    // Atualizar a partida específica no bracket
    let updatedBracket = tournament.bracket.map((match: Match) => 
      match.id === matchId ? { ...match, ...updates } : match
    );
    
    console.log('Bracket after match update, before advancing winner');
    
    // Se a partida foi completada com um vencedor, avançar automaticamente
    if (updates.status === 'completed' && updates.winner) {
      console.log('Match completed with winner, advancing...');
      updatedBracket = advanceWinnerInBracket(updatedBracket, matchId, updates.winner);
    }
    
    console.log('Final bracket after advancing winner:', JSON.stringify(updatedBracket.map((m: Match) => ({
      id: m.id,
      round: m.round,
      position: m.position,
      team1: m.team1?.name || 'null',
      team2: m.team2?.name || 'null',
      winner: m.winner || 'none'
    })), null, 2));
    
    // Verificar se a partida completada é a final (última rodada)
    const maxRound = Math.max(...updatedBracket.map((m: Match) => m.round));
    const completedMatch = updatedBracket.find((m: Match) => m.id === matchId);
    const isFinalMatch = completedMatch && completedMatch.round === maxRound;
    
    // Atualizar torneio
    if (isFinalMatch && updates.status === 'completed') {
      // Se foi a final, atualizar status do torneio para 'completed'
      console.log('Final match completed! Updating tournament status to completed');
      await set(ref(database, `tournaments/${tournamentId}`), {
        ...tournament,
        bracket: updatedBracket,
        status: 'completed'
      });
    } else {
      // Apenas salvar o bracket atualizado
      await set(ref(database, `tournaments/${tournamentId}/bracket`), updatedBracket);
    }
    
    console.log('Match updated and winners advanced successfully!');
    console.log('=== updateMatchAndAdvanceWinners END ===');
    return { success: true, bracket: updatedBracket };
  } catch (error) {
    console.error('Error updating match:', error);
    return { success: false, error };
  }
}

// Função auxiliar para avançar vencedor no bracket
function advanceWinnerInBracket(bracket: Match[], completedMatchId: string, winnerId: string): Match[] {
  const completedMatch = bracket.find(match => match.id === completedMatchId);
  if (!completedMatch) {
    console.log('Completed match not found');
    return bracket;
  }
  
  const winnerTeam = completedMatch.team1?.id === winnerId ? completedMatch.team1 : completedMatch.team2;
  if (!winnerTeam) {
    console.log('Winner team not found');
    return bracket;
  }
  
  console.log(`Advancing winner: ${winnerTeam.name} from match ${completedMatch.id} (round ${completedMatch.round}, pos ${completedMatch.position})`);
  
  // Encontrar a próxima partida onde este vencedor deve ir
  const nextRound = completedMatch.round + 1;
  const nextRoundMatches = bracket.filter(match => match.round === nextRound).sort((a, b) => a.position - b.position);
  
  if (nextRoundMatches.length === 0) {
    // É a final, não há próxima rodada
    console.log('This was the final match, no next round');
    return bracket;
  }
  
  console.log(`Next round matches:`, nextRoundMatches.map(m => `pos=${m.position}, team1=${m.team1?.name || 'null'} (type: ${typeof m.team1}), team2=${m.team2?.name || 'null'} (type: ${typeof m.team2})`));
  
  // Lógica para determinar para qual partida o vencedor deve avançar
  // A lógica varia dependendo da estrutura do torneio
  let targetMatch: Match | null = null;
  let targetPosition: 'team1' | 'team2' | null = null;
  
  // Verificar se alguma partida da próxima rodada já está esperando este vencedor
  // Procurar por uma partida que tenha uma posição vazia (null ou undefined)
  for (const nextMatch of nextRoundMatches) {
    // Se team1 está vazio, este é um candidato
    if (nextMatch.team1 === null || nextMatch.team1 === undefined || !nextMatch.team1) {
      targetMatch = nextMatch;
      targetPosition = 'team1';
      console.log(`Found empty team1 in match pos=${nextMatch.position}`);
      break;
    }
    // Se team2 está vazio, este é um candidato
    if (nextMatch.team2 === null || nextMatch.team2 === undefined || !nextMatch.team2) {
      targetMatch = nextMatch;
      targetPosition = 'team2';
      console.log(`Found empty team2 in match pos=${nextMatch.position}`);
      break;
    }
  }
  
  if (!targetMatch || !targetPosition) {
    console.log('No available position found in next round');
    return bracket;
  }
  
  console.log(`Target: match pos=${targetMatch.position}, placing in ${targetPosition}`);
  
  return bracket.map(match => {
    if (match.id === targetMatch!.id) {
      const updated = { ...match, [targetPosition!]: winnerTeam };
      console.log(`Updated match:`, updated);
      return updated;
    }
    return match;
  });
}

// Manter a função original para compatibilidade
export async function updateMatch(tournamentId: string, matchId: string, updates: Partial<Match>) {
  try {
    // Primeiro, buscar o torneio completo
    const { get } = await import('firebase/database');
    const tournamentRef = ref(database, `tournaments/${tournamentId}`);
    const snapshot = await get(tournamentRef);
    const tournament = snapshot.val();
    
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    // Atualizar a partida específica no bracket
    const updatedBracket = tournament.bracket.map((match: Match) => 
      match.id === matchId ? { ...match, ...updates } : match
    );
    
    // Salvar o bracket atualizado
    await set(ref(database, `tournaments/${tournamentId}/bracket`), updatedBracket);
    
    console.log('Match updated successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error updating match:', error);
    return { success: false, error };
  }
}

// Função para salvar compra de recompensa
export async function saveRewardPurchase(purchaseData: {
  userId: string;
  recompensa: any;
  endereco?: {
    nome: string;
    telefone: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}) {
  try {
    const purchaseRef = ref(database, 'rewardPurchases');
    const newPurchaseRef = push(purchaseRef);
    
    const purchase = {
      id: newPurchaseRef.key,
      userId: purchaseData.userId,
      recompensa: purchaseData.recompensa,
      endereco: purchaseData.endereco || null,
      purchaseDate: new Date().toISOString(),
      status: 'confirmed',
      type: 'reward'
    };
    
    await set(newPurchaseRef, purchase);
    console.log('Reward purchase saved successfully!');
    return { success: true, purchaseId: newPurchaseRef.key };
  } catch (error) {
    console.error('Error saving reward purchase:', error);
    return { success: false, error };
  }
}

// ============= FUNÇÕES PARA GERENCIAMENTO DE PULSEIRAS =============

/**
 * Vincular pulseira a um usuário
 */
export async function linkBandToUser(bandId: string, userId: string, userName: string, userEmail: string) {
  try {
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    
    // Verificar se a pulseira já está vinculada
    const snapshot = await get(bandLinkRef);
    if (snapshot.exists()) {
      const existingLink = snapshot.val() as BandLink;
      if (existingLink.status === 'linked') {
        return { success: false, error: 'Pulseira já está vinculada a outro usuário' };
      }
      if (existingLink.status === 'blocked') {
        return { success: false, error: 'Pulseira está bloqueada' };
      }
    }
    
    const bandLink: BandLink = {
      bandId,
      userId,
      userName,
      userEmail,
      linkedAt: new Date().toISOString(),
      status: 'linked',
      totalPoints: 0
    };
    
    await set(bandLinkRef, bandLink);
    console.log('Band linked successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error linking band:', error);
    return { success: false, error };
  }
}

/**
 * Desvincular pulseira de um usuário
 */
export async function unlinkBand(bandId: string) {
  try {
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    
    // Buscar dados atuais antes de remover
    const snapshot = await get(bandLinkRef);
    if (!snapshot.exists()) {
      return { success: false, error: 'Pulseira não está vinculada' };
    }
    
    // Remover vínculo
    await remove(bandLinkRef);
    console.log('Band unlinked successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error unlinking band:', error);
    return { success: false, error };
  }
}

/**
 * Bloquear pulseira
 */
export async function blockBand(bandId: string) {
  try {
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    
    const snapshot = await get(bandLinkRef);
    if (!snapshot.exists()) {
      // Criar registro bloqueado se não existir
      const bandLink: BandLink = {
        bandId,
        userId: '',
        userName: '',
        userEmail: '',
        linkedAt: new Date().toISOString(),
        status: 'blocked',
        totalPoints: 0
      };
      await set(bandLinkRef, bandLink);
    } else {
      // Atualizar status para bloqueado
      await update(bandLinkRef, { status: 'blocked' });
    }
    
    console.log('Band blocked successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error blocking band:', error);
    return { success: false, error };
  }
}

/**
 * Liberar/desbloquear pulseira
 */
export async function unlockBand(bandId: string) {
  try {
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    
    const snapshot = await get(bandLinkRef);
    if (!snapshot.exists()) {
      return { success: false, error: 'Pulseira não encontrada' };
    }
    
    const bandLink = snapshot.val() as BandLink;
    
    // Se estava vinculada, mantém vinculada; se não, fica disponível
    const newStatus = bandLink.userId ? 'linked' : 'available';
    
    await update(bandLinkRef, { status: newStatus });
    
    console.log('Band unlocked successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error unlocking band:', error);
    return { success: false, error };
  }
}

/**
 * Buscar vínculo de uma pulseira
 */
export async function getBandLink(bandId: string): Promise<BandLink | null> {
  try {
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    const snapshot = await get(bandLinkRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as BandLink;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting band link:', error);
    return null;
  }
}

/**
 * Buscar todas as pulseiras vinculadas de um usuário
 */
export async function getUserBands(userId: string): Promise<BandLink[]> {
  try {
    const bandLinksRef = ref(database, 'bandLinks');
    const snapshot = await get(bandLinksRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const allLinks = snapshot.val();
    const userBands: BandLink[] = [];
    
    Object.values(allLinks).forEach((link: any) => {
      if (link.userId === userId && link.status === 'linked') {
        userBands.push(link as BandLink);
      }
    });
    
    return userBands;
  } catch (error) {
    console.error('Error getting user bands:', error);
    return [];
  }
}

/**
 * Buscar todos os vínculos de pulseiras (para admin)
 */
export async function getAllBandLinks(): Promise<BandLink[]> {
  try {
    const bandLinksRef = ref(database, 'bandLinks');
    const snapshot = await get(bandLinksRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const allLinks = snapshot.val();
    return Object.values(allLinks) as BandLink[];
  } catch (error) {
    console.error('Error getting all band links:', error);
    return [];
  }
}

/**
 * Adicionar pontos a uma pulseira vinculada
 */
export async function addPointsToBand(bandId: string, points: number) {
  try {
    console.log(`[addPointsToBand] Tentando adicionar ${points} pontos à pulseira ${bandId}`)
    const bandLinkRef = ref(database, `bandLinks/${bandId}`);
    
    const snapshot = await get(bandLinkRef);
    console.log(`[addPointsToBand] Snapshot exists: ${snapshot.exists()}`)
    
    if (!snapshot.exists()) {
      console.log(`[addPointsToBand] ❌ Pulseira ${bandId} não está vinculada`)
      return { success: false, error: 'Pulseira não está vinculada' };
    }
    
    const bandLink = snapshot.val() as BandLink;
    console.log(`[addPointsToBand] BandLink atual:`, bandLink)
    
    const newTotalPoints = (bandLink.totalPoints || 0) + points;
    console.log(`[addPointsToBand] Pontos: ${bandLink.totalPoints || 0} + ${points} = ${newTotalPoints}`)
    
    await update(bandLinkRef, { totalPoints: newTotalPoints });
    console.log(`[addPointsToBand] ✓ Pontos atualizados no Firebase`)
    
    // Também adicionar pontos ao usuário
    if (bandLink.userId) {
      console.log(`[addPointsToBand] Atualizando pontos do usuário ${bandLink.userId}`)
      await updateUserPoints(bandLink.userId, points);
      console.log(`[addPointsToBand] ✓ Pontos do usuário atualizados`)
    } else {
      console.log(`[addPointsToBand] ⚠ Pulseira não tem userId vinculado`)
    }
    
    console.log(`[addPointsToBand] ✓ ${points} pontos adicionados à pulseira ${bandId}. Total: ${newTotalPoints}`);
    return { success: true, newTotal: newTotalPoints };
  } catch (error) {
    console.error('[addPointsToBand] ❌ Erro:', error);
    return { success: false, error };
  }
}
