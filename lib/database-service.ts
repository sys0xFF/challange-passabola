import { database } from './firebase';
import { ref, push, set, get } from 'firebase/database';

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
