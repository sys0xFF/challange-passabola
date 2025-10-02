import { database } from './firebase';
import { ref, get, orderByChild, query, set, remove } from 'firebase/database';
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData, Tournament, GameTeam, Match, Game, TicketPurchase, UserProfile } from './database-service';

export interface AdminStats {
  totalTeams: number;
  totalIndividuals: number;
  totalVolunteers: number;
  totalDonations: number;
  totalPurchases: number;
  totalTournaments: number;
  totalGames: number;
  totalTicketsSold: number;
  totalUsers: number;
  totalRevenue: number;
  totalDonationAmount: number;
  totalTicketRevenue: number;
}
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [teams, individuals, volunteers, donations, purchases, tournaments, users, games, tickets] = await Promise.all([
      get(ref(database, 'Teams')),
      get(ref(database, 'Individuals')),
      get(ref(database, 'volunteers')),
      get(ref(database, 'donors')),
      get(ref(database, 'purchases')),
      get(ref(database, 'tournaments')),
      get(ref(database, 'users')),
      get(ref(database, 'games')),
      get(ref(database, 'ticketPurchases'))
    ]);

    const teamsData = teams.val() || {};
    const individualsData = individuals.val() || {};
    const volunteersData = volunteers.val() || {};
    const donationsData = donations.val() || {};
    const purchasesData = purchases.val() || {};
    const tournamentsData = tournaments.val() || {};
    const usersData = users.val() || {};
    const gamesData = games.val() || {};
    const ticketsData = tickets.val() || {};

    // Calcular receita total das compras
    const totalRevenue = Object.values(purchasesData).reduce((acc: number, purchase: any) => {
      return acc + (purchase.pricing?.total || 0);
    }, 0);

    // Calcular total de doações
    const totalDonationAmount = Object.values(donationsData).reduce((acc: number, donation: any) => {
      return acc + (donation.amount || 0);
    }, 0);

    // Calcular receita total dos ingressos
    const totalTicketRevenue = Object.values(ticketsData).reduce((acc: number, ticket: any) => {
      return acc + (ticket.totalPrice || 0);
    }, 0);

    // Calcular total de ingressos vendidos
    const totalTicketsSold = Object.values(ticketsData).reduce((acc: number, ticket: any) => {
      return acc + (ticket.quantity || 0);
    }, 0);

    return {
      totalTeams: Object.keys(teamsData).length,
      totalIndividuals: Object.keys(individualsData).length,
      totalVolunteers: Object.keys(volunteersData).length,
      totalDonations: Object.keys(donationsData).length,
      totalPurchases: Object.keys(purchasesData).length,
      totalTournaments: Object.keys(tournamentsData).length,
      totalGames: Object.keys(gamesData).length,
      totalTicketsSold,
      totalUsers: Object.keys(usersData).length,
      totalRevenue,
      totalDonationAmount,
      totalTicketRevenue
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

  // Primeira rodada - 4 equipes jogam, 2 melhores passam direto
  // Times 2,3,4,5 jogam (times 0,1 passam direto para semifinais)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[2], // 3º colocado
    team2: teams[5], // 6º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[3], // 4º colocado
    team2: teams[4], // 5º colocado
    status: 'pending'
  });

  // Semifinais - 2 melhores times + 2 vencedores da primeira rodada
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0], // 1º colocado (passa direto)
    team2: null,     // Vencedor do match-2 (teams[3] vs teams[4])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1], // 2º colocado (passa direto)
    team2: null,     // Vencedor do match-1 (teams[2] vs teams[5])
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null, // Vencedor semifinal 1
    team2: null, // Vencedor semifinal 2
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
  console.log('=== generateTenTeamBracket ===')
  console.log('Received teams:', teams.length)
  console.log('Teams:', teams.map((t, i) => `${i}: ${t.name}`))
  
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 4 piores times jogam (6 melhores passam direto)
  // Times 6,7,8,9 jogam (times 0,1,2,3,4,5 passam direto para quartas)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[6], // 7º colocado
    team2: teams[9], // 10º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[7], // 8º colocado
    team2: teams[8], // 9º colocado
    status: 'pending'
  });

  // Quartas de final - 6 melhores times + 2 vencedores da primeira rodada
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0], // 1º colocado
    team2: null,     // Vencedor match-2 (teams[7] vs teams[8])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1], // 2º colocado
    team2: null,     // Vencedor match-1 (teams[6] vs teams[9])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: teams[2], // 3º colocado
    team2: teams[5], // 6º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: teams[3], // 4º colocado
    team2: teams[4], // 5º colocado
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null, // Vencedor quartas 1
    team2: null, // Vencedor quartas 2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null, // Vencedor quartas 3
    team2: null, // Vencedor quartas 4
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null, // Vencedor semifinal 1
    team2: null, // Vencedor semifinal 2
    status: 'pending'
  });

  return matches;
}

function generateTwelveTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 8 piores times jogam (4 melhores passam direto para quartas)
  // Times 4,5,6,7,8,9,10,11 jogam (times 0,1,2,3 passam direto)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[4],  // 5º colocado
    team2: teams[11], // 12º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[5],  // 6º colocado
    team2: teams[10], // 11º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 3,
    team1: teams[6], // 7º colocado
    team2: teams[9], // 10º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 4,
    team1: teams[7], // 8º colocado
    team2: teams[8], // 9º colocado
    status: 'pending'
  });

  // Quartas de final - 4 melhores times + 4 vencedores da primeira rodada
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0], // 1º colocado
    team2: null,     // Vencedor match-4 (teams[7] vs teams[8])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1], // 2º colocado
    team2: null,     // Vencedor match-3 (teams[6] vs teams[9])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: teams[2], // 3º colocado
    team2: null,     // Vencedor match-2 (teams[5] vs teams[10])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: teams[3], // 4º colocado
    team2: null,     // Vencedor match-1 (teams[4] vs teams[11])
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null, // Vencedor quartas 1
    team2: null, // Vencedor quartas 2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null, // Vencedor quartas 3
    team2: null, // Vencedor quartas 4
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null, // Vencedor semifinal 1
    team2: null, // Vencedor semifinal 2
    status: 'pending'
  });

  return matches;
}

function generateFourteenTeamBracket(teams: GameTeam[], startMatchId: number): Match[] {
  const matches: Match[] = [];
  let matchId = startMatchId;

  // Primeira rodada - 12 piores times jogam (2 melhores passam direto para quartas)
  // Times 2,3,4,5,6,7,8,9,10,11,12,13 jogam (times 0,1 passam direto)
  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 1,
    team1: teams[2],  // 3º colocado
    team2: teams[13], // 14º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 2,
    team1: teams[3],  // 4º colocado
    team2: teams[12], // 13º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 3,
    team1: teams[4],  // 5º colocado
    team2: teams[11], // 12º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 4,
    team1: teams[5],  // 6º colocado
    team2: teams[10], // 11º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 5,
    team1: teams[6], // 7º colocado
    team2: teams[9], // 10º colocado
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 1,
    position: 6,
    team1: teams[7], // 8º colocado
    team2: teams[8], // 9º colocado
    status: 'pending'
  });

  // Quartas de final - 2 melhores times + 6 vencedores da primeira rodada
  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 1,
    team1: teams[0], // 1º colocado
    team2: null,     // Vencedor match-6 (teams[7] vs teams[8])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 2,
    team1: teams[1], // 2º colocado
    team2: null,     // Vencedor match-5 (teams[6] vs teams[9])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 3,
    team1: null, // Vencedor match-1 (teams[2] vs teams[13])
    team2: null, // Vencedor match-4 (teams[5] vs teams[10])
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 2,
    position: 4,
    team1: null, // Vencedor match-2 (teams[3] vs teams[12])
    team2: null, // Vencedor match-3 (teams[4] vs teams[11])
    status: 'pending'
  });

  // Semifinais
  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 1,
    team1: null, // Vencedor quartas 1
    team2: null, // Vencedor quartas 2
    status: 'pending'
  });

  matches.push({
    id: `match-${matchId++}`,
    round: 3,
    position: 2,
    team1: null, // Vencedor quartas 3
    team2: null, // Vencedor quartas 4
    status: 'pending'
  });

  // Final
  matches.push({
    id: `match-${matchId++}`,
    round: 4,
    position: 1,
    team1: null, // Vencedor semifinal 1
    team2: null, // Vencedor semifinal 2
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

export function generateAutoTeamsFromIndividuals(individuals: Array<IndividualRegistration & { id: string }>, maxTeams?: number): GameTeam[] {
  const teams: GameTeam[] = [];
  const playersPerTeam = 7; // 6 jogadoras + 1 goleira
  
  console.log('=== generateAutoTeamsFromIndividuals ===')
  console.log('Total individuals:', individuals.length)
  console.log('Max teams requested:', maxTeams)
  
  // Separar por posição
  const goalkeepers = individuals.filter(ind => ind.captainData.posicao.toLowerCase().includes('goleira'));
  const fieldPlayers = individuals.filter(ind => !ind.captainData.posicao.toLowerCase().includes('goleira'));
  
  console.log('Goalkeepers:', goalkeepers.length)
  console.log('Field players:', fieldPlayers.length)
  
  // Embaralhar arrays para distribuição aleatória
  const shuffledGoalkeepers = [...goalkeepers].sort(() => Math.random() - 0.5);
  const shuffledFieldPlayers = [...fieldPlayers].sort(() => Math.random() - 0.5);
  
  // Calcular quantos times podemos formar com os jogadores disponíveis
  let numPossibleTeams = Math.min(
    shuffledGoalkeepers.length, 
    Math.floor(shuffledFieldPlayers.length / 6)
  );
  
  console.log('Possible teams from players:', numPossibleTeams)
  
  // Se foi especificado um máximo de times, usar esse valor
  if (maxTeams && maxTeams > 0) {
    numPossibleTeams = Math.min(numPossibleTeams, maxTeams);
  } else {
    // Apenas se não foi especificado maxTeams, tentar fazer número par
    if (numPossibleTeams > 1 && numPossibleTeams % 2 !== 0) {
      numPossibleTeams = numPossibleTeams - 1;
    }
  }
  
  console.log('Final number of teams to generate:', numPossibleTeams)
  
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
        // Ordenar as partidas da rodada atual por posição para processamento ordenado
        const sortedRoundMatches = [...roundMatches].sort((a, b) => a.position - b.position);
        
        sortedRoundMatches.forEach((match, index) => {
          if (match.winner && match.status === 'completed') {
            const winnerTeam = match.team1?.id === match.winner ? match.team1 : match.team2;
            
            // Calcular qual partida da próxima rodada deve receber este vencedor
            const nextMatchIndex = Math.floor(index / 2);
            const nextMatchToUpdate = nextRoundMatches.find((m: Match) => m.position === nextMatchIndex + 1);
            
            if (nextMatchToUpdate && winnerTeam) {
              const updatedNextMatchIndex = updatedBracket.findIndex(m => m.id === nextMatchToUpdate.id);
              if (updatedNextMatchIndex !== -1) {
                const nextMatch = updatedBracket[updatedNextMatchIndex];
                
                // Verificar se este vencedor já foi colocado nesta partida para evitar duplicação
                const winnerAlreadyInNextMatch = nextMatch.team1?.id === winnerTeam.id || nextMatch.team2?.id === winnerTeam.id;
                
                if (!winnerAlreadyInNextMatch) {
                  // Determinar se vai para team1 ou team2 baseado na posição original da partida
                  const isFirstTeamInPair = index % 2 === 0;
                  
                  if (isFirstTeamInPair && nextMatch.team1 === null) {
                    updatedBracket[updatedNextMatchIndex] = {
                      ...updatedBracket[updatedNextMatchIndex],
                      team1: winnerTeam
                    };
                  } else if (!isFirstTeamInPair && nextMatch.team2 === null) {
                    updatedBracket[updatedNextMatchIndex] = {
                      ...updatedBracket[updatedNextMatchIndex],
                      team2: winnerTeam
                    };
                  } else {
                    // Se a posição preferida já está ocupada, usar a vazia disponível
                    if (nextMatch.team1 === null) {
                      updatedBracket[updatedNextMatchIndex] = {
                        ...updatedBracket[updatedNextMatchIndex],
                        team1: winnerTeam
                      };
                    } else if (nextMatch.team2 === null) {
                      updatedBracket[updatedNextMatchIndex] = {
                        ...updatedBracket[updatedNextMatchIndex],
                        team2: winnerTeam
                      };
                    }
                  }
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
    return { success: false, bracket: bracket, error };
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

// Novas funções para Jogos e Ingressos

export async function getAllGames(): Promise<Array<Game & { id: string }>> {
  try {
    const gamesRef = ref(database, 'games');
    const snapshot = await get(gamesRef);
    const gamesData = snapshot.val() || {};
    
    return Object.keys(gamesData).map(id => ({
      id,
      ...gamesData[id]
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

export async function getAllTickets(): Promise<Array<TicketPurchase & { id: string }>> {
  try {
    const ticketsRef = ref(database, 'ticketPurchases');
    const snapshot = await get(ticketsRef);
    const ticketsData = snapshot.val() || {};

    return Object.keys(ticketsData).map(id => ({
      id,
      ...ticketsData[id]
    }));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}export async function getGamesByTournament(tournamentId: string): Promise<Array<Game & { id: string }>> {
  try {
    const gamesRef = ref(database, 'games');
    const snapshot = await get(gamesRef);
    const gamesData = snapshot.val() || {};
    
    return Object.keys(gamesData)
      .filter(id => gamesData[id].tournamentId === tournamentId)
      .map(id => ({
        id,
        ...gamesData[id]
      }));
  } catch (error) {
    console.error('Error fetching games by tournament:', error);
    return [];
  }
}

export async function updateGame(gameId: string, updates: Partial<Game>): Promise<{ success: boolean; error?: any }> {
  try {
    const gameRef = ref(database, `games/${gameId}`);
    const snapshot = await get(gameRef);
    const existingData = snapshot.val();
    
    if (!existingData) {
      throw new Error('Game not found');
    }
    
    const updatedGame = {
      ...existingData,
      ...updates
    };
    
    await set(gameRef, updatedGame);
    
    console.log('Game updated successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error updating game:', error);
    return { success: false, error };
  }
}

export async function deleteGame(gameId: string): Promise<{ success: boolean; error?: any }> {
  try {
    await set(ref(database, `games/${gameId}`), null);
    return { success: true };
  } catch (error) {
    console.error('Error deleting game:', error);
    return { success: false, error };
  }
}

export async function getUserTickets(userId: string): Promise<Array<TicketPurchase & { id: string }>> {
  try {
    const ticketsRef = ref(database, 'ticketPurchases');
    const snapshot = await get(ticketsRef);
    const ticketsData = snapshot.val() || {};

    return Object.keys(ticketsData)
      .filter(id => ticketsData[id].userId === userId)
      .map(id => ({
        id,
        ...ticketsData[id]
      }));
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return [];
  }
}export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userSnapshot = await get(ref(database, `users/${userId}`));
    
    if (!userSnapshot.exists()) {
      return null;
    }

    const userData = userSnapshot.val();
    const userTickets = await getUserTickets(userId);

    return {
      id: userId,
      ...userData,
      tickets: userTickets
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserPoints(userId: string, newPoints: number): Promise<{ success: boolean; error?: any }> {
  try {
    const userRef = ref(database, `users/${userId}/points`)
    await set(userRef, newPoints)
    return { success: true }
  } catch (error) {
    console.error('Error updating user points:', error)
    return { success: false, error }
  }
}

export async function deductUserPoints(userId: string, pointsToDeduct: number): Promise<{ success: boolean; error?: any }> {
  try {
    const userRef = ref(database, `users/${userId}`)
    const snapshot = await get(userRef)
    const userData = snapshot.val()
    
    if (!userData) {
      return { success: false, error: 'User not found' }
    }
    
    const currentPoints = userData.points || 0
    const newPoints = Math.max(0, currentPoints - pointsToDeduct)
    
    await set(ref(database, `users/${userId}/points`), newPoints)
    return { success: true }
  } catch (error) {
    console.error('Error deducting user points:', error)
    return { success: false, error }
  }
}
