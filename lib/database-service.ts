import { database } from './firebase';
import { ref, push, set } from 'firebase/database';

export interface TeamRegistration {
  type: 'team';
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
