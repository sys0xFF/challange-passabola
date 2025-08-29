import { database } from './firebase';
import { ref, get, orderByChild, query } from 'firebase/database';
import { TeamRegistration, IndividualRegistration, VolunteerRegistration, DonationData, PurchaseData } from './database-service';

export interface AdminStats {
  totalTeams: number;
  totalIndividuals: number;
  totalVolunteers: number;
  totalDonations: number;
  totalPurchases: number;
  totalRevenue: number;
  totalDonationAmount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [teams, individuals, volunteers, donations, purchases] = await Promise.all([
      get(ref(database, 'Teams')),
      get(ref(database, 'Individuals')),
      get(ref(database, 'volunteers')),
      get(ref(database, 'donors')),
      get(ref(database, 'purchases'))
    ]);

    const teamsData = teams.val() || {};
    const individualsData = individuals.val() || {};
    const volunteersData = volunteers.val() || {};
    const donationsData = donations.val() || {};
    const purchasesData = purchases.val() || {};

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
