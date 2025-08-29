import { database } from './firebase';
import { ref, get, orderByChild, query, set } from 'firebase/database';
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData, Tournament, GameTeam, Match } from './database-service';

export interface AdminStats {
  totalTeams: number;
  totalIndividuals: number;
  totalVolunteers: number;
  totalDonations: number;
  totalPurchases: number;
  totalTournaments: number;
  totalRevenue: number;
  totalDonationAmount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [teams, individuals, volunteers, donations, purchases, tournaments] = await Promise.all([
      get(ref(database, 'Teams')),
      get(ref(database, 'Individuals')),
      get(ref(database, 'volunteers')),
      get(ref(database, 'donors')),
      get(ref(database, 'purchases')),
      get(ref(database, 'tournaments'))
    ]);

    const teamsData = teams.val() || {};
    const individualsData = individuals.val() || {};
    const volunteersData = volunteers.val() || {};
    const donationsData = donations.val() || {};
    const purchasesData = purchases.val() || {};
    const tournamentsData = tournaments.val() || {};

    // Calcular receita total das compras
    const totalRevenue = Object.values(purchasesData).reduce((acc: number, purchase: any) => {
      return acc + (purchase.pricing?.total || 0);
    }, 0);

    // Calcular total de doações
    const totalDonationAmount = Object.values(donationsData).reduce((acc: number, donation: any) => {
      return acc + (donation.amount || 0);
    }, 0);

    return {
      totalTeams: Object.keys(teamsData).length,
      totalIndividuals: Object.keys(individualsData).length,
      totalVolunteers: Object.keys(volunteersData).length,
      totalDonations: Object.keys(donationsData).length,
      totalPurchases: Object.keys(purchasesData).length,
      totalTournaments: Object.keys(tournamentsData).length,
      totalRevenue,
      totalDonationAmount
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

export async function getAllTeams(): Promise<Array<TeamRegistration & { id: string }>> {
  try {
    const teamsRef = ref(database, 'Teams');
    const snapshot = await get(teamsRef);
    const teamsData = snapshot.val() || {};
    
    return Object.entries(teamsData).map(([id, data]) => ({
      id,
      ...(data as TeamRegistration)
    }));
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

export async function getAllIndividuals(): Promise<Array<IndividualRegistration & { id: string }>> {
  try {
    const individualsRef = ref(database, 'Individuals');
    const snapshot = await get(individualsRef);
    const individualsData = snapshot.val() || {};
    
    return Object.entries(individualsData).map(([id, data]) => ({
      id,
      ...(data as IndividualRegistration)
    }));
  } catch (error) {
    console.error('Error fetching individuals:', error);
    throw error;
  }
}

export async function getAllVolunteers(): Promise<Array<VolunteerRegistration & { id: string }>> {
  try {
    const volunteersRef = ref(database, 'volunteers');
    const snapshot = await get(volunteersRef);
    const volunteersData = snapshot.val() || {};
    
    return Object.entries(volunteersData).map(([id, data]) => ({
      id,
      ...(data as VolunteerRegistration)
    }));
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
}

export async function getAllDonations(): Promise<Array<DonationData & { id: string }>> {
  try {
    const donationsRef = ref(database, 'donors');
    const snapshot = await get(donationsRef);
    const donationsData = snapshot.val() || {};
    
    return Object.entries(donationsData).map(([id, data]) => ({
      id,
      ...(data as DonationData)
    }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
}

export async function getAllPurchases(): Promise<Array<PurchaseData & { id: string }>> {
  try {
    const purchasesRef = ref(database, 'purchases');
    const snapshot = await get(purchasesRef);
    const purchasesData = snapshot.val() || {};
    
    return Object.entries(purchasesData).map(([id, data]) => ({
      id,
      ...(data as PurchaseData)
    }));
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
}

export async function getAllTournaments(): Promise<Array<Tournament & { id: string }>> {
  try {
    const tournamentsRef = ref(database, 'tournaments');
    const snapshot = await get(tournamentsRef);
    const tournamentsData = snapshot.val() || {};
    
    return Object.entries(tournamentsData).map(([id, data]) => ({
      ...(data as Tournament),
      id
    }));
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
}

export async function getTournament(tournamentId: string): Promise<Tournament | null> {
  try {
    const tournamentRef = ref(database, `tournaments/${tournamentId}`);
    const snapshot = await get(tournamentRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as Tournament;
    }
    return null;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
}

export function generateAutomaticBracket(teams: GameTeam[]): Match[] {
  const numTeams = teams.length;
  if (numTeams < 2) return [];

  // Para torneios eliminatórios, precisamos de potência de 2
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  
  const matches: Match[] = [];
  let matchId = 1;

  // Primeira rodada
  const firstRoundMatches = nextPowerOf2 / 2;
  
  for (let i = 0; i < firstRoundMatches; i++) {
    const team1 = i < teams.length ? teams[i] : null;
    const team2 = (i + firstRoundMatches) < teams.length ? teams[i + firstRoundMatches] : null;
    
    matches.push({
      id: `match-${matchId}`,
      round: 1,
      position: i + 1,
      team1,
      team2,
      status: 'pending'
    });
    matchId++;
  }

  // Gerar rodadas subsequentes
  let currentRoundMatches = firstRoundMatches;
  let round = 2;

  while (currentRoundMatches > 1) {
    const nextRoundMatches = currentRoundMatches / 2;
    
    for (let i = 0; i < nextRoundMatches; i++) {
      matches.push({
        id: `match-${matchId}`,
        round,
        position: i + 1,
        team1: null,
        team2: null,
        status: 'pending'
      });
      matchId++;
    }
    
    currentRoundMatches = nextRoundMatches;
    round++;
  }

  return matches;
}

export function generateAutoTeamsFromIndividuals(individuals: Array<IndividualRegistration & { id: string }>): GameTeam[] {
  const teams: GameTeam[] = [];
  const playersPerTeam = 7; // 6 jogadoras + 1 goleira
  
  // Separar por posição
  const goalkeepers = individuals.filter(ind => ind.captainData.posicao.toLowerCase().includes('goleira'));
  const fieldPlayers = individuals.filter(ind => !ind.captainData.posicao.toLowerCase().includes('goleira'));
  
  // Embaralhar arrays para distribuição aleatória
  const shuffledGoalkeepers = [...goalkeepers].sort(() => Math.random() - 0.5);
  const shuffledFieldPlayers = [...fieldPlayers].sort(() => Math.random() - 0.5);
  
  const numPossibleTeams = Math.min(
    shuffledGoalkeepers.length, 
    Math.floor(shuffledFieldPlayers.length / 6)
  );
  
  for (let i = 0; i < numPossibleTeams; i++) {
    const teamPlayers = [];
    
    // Adicionar goleira
    if (shuffledGoalkeepers[i]) {
      teamPlayers.push({
        id: shuffledGoalkeepers[i].id,
        name: shuffledGoalkeepers[i].captainData.nomeCompleto,
        position: shuffledGoalkeepers[i].captainData.posicao,
        isFromIndividual: true,
        individualId: shuffledGoalkeepers[i].id
      });
    }
    
    // Adicionar jogadoras de linha
    for (let j = 0; j < 6 && (i * 6 + j) < shuffledFieldPlayers.length; j++) {
      const playerIndex = i * 6 + j;
      teamPlayers.push({
        id: shuffledFieldPlayers[playerIndex].id,
        name: shuffledFieldPlayers[playerIndex].captainData.nomeCompleto,
        position: shuffledFieldPlayers[playerIndex].captainData.posicao,
        isFromIndividual: true,
        individualId: shuffledFieldPlayers[playerIndex].id
      });
    }
    
    teams.push({
      id: `auto-team-${i + 1}`,
      name: `Time Auto ${i + 1}`,
      type: 'auto-generated',
      players: teamPlayers
    });
  }
  
  return teams;
}

export async function updateTournamentBracket(tournamentId: string, bracket: Match[]): Promise<{ success: boolean; error?: any }> {
  try {
    const tournamentRef = ref(database, `tournaments/${tournamentId}/bracket`);
    await set(tournamentRef, bracket);
    
    console.log('Tournament bracket updated successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error updating tournament bracket:', error);
    return { success: false, error };
  }
}
