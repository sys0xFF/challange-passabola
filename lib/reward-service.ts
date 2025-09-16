import { database } from './firebase';
import { ref, push, set } from 'firebase/database';

export interface RewardPurchase {
  id: string;
  userId: string;
  recompensa: {
    id: number;
    nome: string;
    pontos: number;
    categoria: string;
    tipo: 'produto' | 'experiencia' | 'especial';
  };
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
  purchaseDate: string;
  status: 'confirmed' | 'pending' | 'shipped' | 'delivered';
  type: 'reward';
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
    
    const purchase: RewardPurchase = {
      id: newPurchaseRef.key || '',
      userId: purchaseData.userId,
      recompensa: {
        id: purchaseData.recompensa.id,
        nome: purchaseData.recompensa.nome,
        pontos: purchaseData.recompensa.pontos,
        categoria: purchaseData.recompensa.categoria,
        tipo: purchaseData.recompensa.tipo || 'produto'
      },
      endereco: purchaseData.endereco || undefined,
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
