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
  totalUsers: number;
  totalRevenue: number;
  totalDonationAmount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [teams, individuals, volunteers, donations, purchases, tournaments, users] = await Promise.all([
      get(ref(database, 'Teams')),
      get(ref(database, 'Individuals')),
      get(ref(database, 'volunteers')),
      get(ref(database, 'donors')),
      get(ref(database, 'purchases')),
      get(ref(database, 'tournaments')),
      get(ref(database, 'users'))
    ]);

    const teamsData = teams.val() || {};
    const individualsData = individuals.val() || {};
    const volunteersData = volunteers.val() || {};
    const donationsData = donations.val() || {};
    const purchasesData = purchases.val() || {};
    const tournamentsData = tournaments.val() || {};
    const usersData = users.val() || {};

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
      totalUsers: Object.keys(usersData).length,
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

  // Verificar se é número par
  if (numTeams % 2 !== 0) {
    console.error('Número de times deve ser par para gerar chaveamento');
    return [];
  }

  // Suporte até 16 times
  if (numTeams > 16) {
    console.error('Sistema suporta no máximo 16 times');
    return [];
  }

  const matches: Match[] = [];
  let matchId = 1;

  // Definir estrutura baseada no número de times
  if (numTeams === 2) {
    return generateFinal(teams, matchId);
  } else if (numTeams === 4) {
    return generateSemiFinals(teams, matchId);
  } else if (numTeams === 6) {
    return generateSixTeamBracket(teams, matchId);
  } else if (numTeams === 8) {
    return generateQuarterFinals(teams, matchId);
  } else if (numTeams === 10) {
    return generateTenTeamBracket(teams, matchId);
  } else if (numTeams === 12) {
    return generateTwelveTeamBracket(teams, matchId);
  } else if (numTeams === 14) {
    return generateFourteenTeamBracket(teams, matchId);
  } else if (numTeams === 16) {
    return generateSixteenTeamBracket(teams, matchId);
  }

  return matches;
}

// Funções específicas para cada formato
function generateFinal(teams: GameTeam[], startMatchId: number): Match[] {
  return [{
    id: `match-${startMatchId}`,
    round: 1,
    position: 1,
    team1: teams[0],
    team2: teams[1],
    status: 'pending'
  }];
}

function generateSemiFinals(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[0],
    team2: teams[3],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[1],
    team2: teams[2],
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateSixTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 2 jogos (4 times jogam, 2 passam direto)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[2],
    team2: teams[5],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[3],
    team2: teams[4],
    status: 'pending'
  });

  // Semifinais - times que passaram direto + vencedores
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0], // Passa direto
    team2: null,     // Vencedor do match-1
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1], // Passa direto
    team2: null,     // Vencedor do match-2
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateQuarterFinals(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Quartas de final
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[0],
    team2: teams[7],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[1],
    team2: teams[6],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 3,
    team1: teams[2],
    team2: teams[5],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 4,
    team1: teams[3],
    team2: teams[4],
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: null,
    team2: null,
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateTenTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 2 jogos (4 times jogam)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[6],
    team2: teams[9],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[7],
    team2: teams[8],
    status: 'pending'
  });

  // Quartas de final - 6 times que passaram direto + 2 vencedores
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0],
    team2: null, // Vencedor match-1
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1],
    team2: null, // Vencedor match-2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: teams[2],
    team2: teams[5],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: teams[3],
    team2: teams[4],
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null,
    team2: null,
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateTwelveTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 4 jogos (8 times jogam)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[4],
    team2: teams[11],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[5],
    team2: teams[10],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 3,
    team1: teams[6],
    team2: teams[9],
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 4,
    team1: teams[7],
    team2: teams[8],
    status: 'pending'
  });

  // Quartas de final - 4 times que passaram direto + 4 vencedores
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0],
    team2: null, // Vencedor match-1
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1],
    team2: null, // Vencedor match-2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: teams[2],
    team2: null, // Vencedor match-3
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: teams[3],
    team2: null, // Vencedor match-4
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null,
    team2: null,
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateFourteenTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 6 jogos (12 times jogam)
  for (let i = 0; i < 6; i++) {
    matches.push({
      id: `match-${matchId++}`,
      round: 1,
      position: i + 1,
      team1: teams[2 + i],
      team2: teams[13 - i],
      status: 'pending'
    });
  }

  // Quartas de final - 2 times que passaram direto + 6 vencedores
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0],
    team2: null, // Vencedor match-1
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1],
    team2: null, // Vencedor match-2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: null, // Vencedor match-3
    team2: null, // Vencedor match-4
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: null, // Vencedor match-5
    team2: null, // Vencedor match-6
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null,
    team2: null,
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

  return matches;
}

function generateSixteenTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Oitavas de final - 8 jogos
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: `match-${matchId++}`,
      round: 1,
      position: i + 1,
      team1: teams[i],
      team2: teams[15 - i],
      status: 'pending'
    });
  }

  // Quartas de final - 4 jogos
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `match-${matchId++}`,
      round: 2,
      position: i + 1,
      team1: null,
      team2: null,
      status: 'pending'
    });
  }

  // Semifinais - 2 jogos
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `match-${matchId++}`,
      round: 3,
      position: i + 1,
      team1: null,
      team2: null,
      status: 'pending'
    });
  }

  // Final - 1 jogo
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null,
    team2: null,
    status: 'pending'
  });

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
  
  let numPossibleTeams = Math.min(
    shuffledGoalkeepers.length, 
    Math.floor(shuffledFieldPlayers.length / 6)
  );
  
  // Tentar fazer número par de times se possível
  if (numPossibleTeams > 1 && numPossibleTeams % 2 !== 0) {
    // Se o número é ímpar e maior que 1, reduzir em 1 para tornar par
    numPossibleTeams = numPossibleTeams - 1;
  }
  
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

export async function updateTournamentBracket(tournamentId: string, bracket: Match[], teams: GameTeam[]): Promise<{ success: boolean; error?: any }> {
  try {
    // Atualizar tanto o bracket quanto os teams e o status do torneio
    const updates = {
      bracket,
      teams,
      status: 'in-progress' as const // Mudar status para "em andamento" quando o chaveamento for salvo
    };
    
    const { updateTournament } = await import('./database-service');
    const result = await updateTournament(tournamentId, updates);
    
    if (result.success) {
      console.log('Tournament bracket, teams and status updated successfully!');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating tournament bracket:', error);
    return { success: false, error };
  }
}

export async function advanceWinnersToNextRound(tournamentId: string, bracket: Match[]): Promise<{ success: boolean; bracket: Match[]; error?: any }> {
  try {
    const updatedBracket = [...bracket];
    
    // Agrupar partidas por rodada
    const matchesByRound = bracket.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);
    
    // Para cada rodada, verificar se há vencedores para avançar
    Object.keys(matchesByRound).forEach(roundStr => {
      const round = parseInt(roundStr);
      const roundMatches = matchesByRound[round];
      const nextRound = round + 1;
      const nextRoundMatches = matchesByRound[nextRound];
      
      if (nextRoundMatches) {
        roundMatches.forEach((match, index) => {
          if (match.winner && match.status === 'completed') {
            const winnerTeam = match.team1?.id === match.winner ? match.team1 : match.team2;
            const nextMatchIndex = Math.floor(index / 2);
            const nextMatch = nextRoundMatches[nextMatchIndex];
            
            if (nextMatch) {
              const updatedNextMatchIndex = updatedBracket.findIndex(m => m.id === nextMatch.id);
              if (updatedNextMatchIndex !== -1) {
                // Determinar se o vencedor vai para team1 ou team2 da próxima partida
                const isFirstSlot = index % 2 === 0;
                if (isFirstSlot) {
                  updatedBracket[updatedNextMatchIndex] = {
                    ...updatedBracket[updatedNextMatchIndex],
                    team1: winnerTeam
                  };
                } else {
                  updatedBracket[updatedNextMatchIndex] = {
                    ...updatedBracket[updatedNextMatchIndex],
                    team2: winnerTeam
                  };
                }
              }
            }
          }
        });
      }
    });
    
    // Verificar se o torneio foi finalizado (última rodada tem vencedor)
    const maxRound = Math.max(...bracket.map(m => m.round));
    const finalMatch = bracket.find(m => m.round === maxRound);
    const tournamentCompleted = finalMatch && finalMatch.status === 'completed';
    
    // Atualizar o torneio com o bracket atualizado e status se necessário
    const { updateTournament } = await import('./database-service');
    const updates: any = { bracket: updatedBracket };
    
    if (tournamentCompleted) {
      updates.status = 'completed' as const;
    }
    
    const result = await updateTournament(tournamentId, updates);
    
    return { success: result.success, bracket: updatedBracket, error: result.error };
  } catch (error) {
    console.error('Error advancing winners:', error);
    return { success: false, bracket, error };
  }
}

// Função para buscar todos os usuários
export async function getAllUsers(): Promise<any[]> {
  try {
    const usersSnapshot = await get(ref(database, 'users'));
    
    if (!usersSnapshot.exists()) {
      return [];
    }

    const usersData = usersSnapshot.val();
    return Object.entries(usersData).map(([id, user]: [string, any]) => ({
      id,
      ...user
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Função para deletar usuário
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: any }> {
  try {
    await set(ref(database, `users/${userId}`), null);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
}

// Função para buscar usuário por ID
export async function getUserById(userId: string): Promise<any | null> {
  try {
    const userSnapshot = await get(ref(database, `users/${userId}`));
    
    if (!userSnapshot.exists()) {
      return null;
    }

    return { id: userId, ...userSnapshot.val() };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}
