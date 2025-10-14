'use client';

import { useEffect, useState } from 'react';
import { useNext2025Auth } from '@/contexts/next2025-auth-context';
import {
  Next2025Header,
  Next2025Card,
  Next2025Button,
  Next2025EmptyState,
  Next2025Loading
} from '@/components/next2025/shared';
import {
  getAvailableRewards,
  getUserClaims,
  claimReward,
  Next2025Reward,
  Next2025RewardClaim
} from '@/lib/next2025-service';
import { Gift, Package, CheckCircle2, Clock, Loader2, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function RecompensasPage() {
  const { user, refreshUser } = useNext2025Auth();
  const [availableRewards, setAvailableRewards] = useState<Next2025Reward[]>([]);
  const [userClaims, setUserClaims] = useState<Next2025RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [rewards, claims] = await Promise.all([
        getAvailableRewards(),
        getUserClaims(user.id)
      ]);

      setAvailableRewards(rewards);
      setUserClaims(claims);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast.error('Erro ao carregar recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (reward: Next2025Reward) => {
    if (!user) return;

    if (user.points < reward.pointsCost) {
      toast.error('Pontos insuficientes!');
      return;
    }

    if (!confirm(`Deseja resgatar "${reward.name}" por ${reward.pointsCost} pontos?`)) {
      return;
    }

    setClaimingId(reward.id);
    try {
      const result = await claimReward(user.id, reward.id);

      if (result.success) {
        toast.success('Recompensa resgatada com sucesso!');
        await refreshUser();
        await loadData();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || 'Erro ao resgatar recompensa';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Erro ao resgatar recompensa');
    } finally {
      setClaimingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Package className="h-3 w-3" />
            Pronto para retirada
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Entregue
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Header */}
      <Next2025Header>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-pink-500/10 p-2">
            <Gift className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Recompensas</h1>
            <p className="text-sm text-muted-foreground">
              {user.points} pontos disponíveis
            </p>
          </div>
        </div>
      </Next2025Header>

      {loading ? (
        <Next2025Loading message="Carregando recompensas..." />
      ) : (
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Disponíveis
            </TabsTrigger>
            <TabsTrigger value="claimed" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Minhas Recompensas
            </TabsTrigger>
          </TabsList>

          {/* Recompensas Disponíveis */}
          <TabsContent value="available" className="space-y-4">
            {availableRewards.length > 0 ? (
              <div className="space-y-4">
                {availableRewards.map((reward) => {
                  const canAfford = user.points >= reward.pointsCost;
                  const availableQuantity = reward.quantity - reward.claimed;

                  return (
                    <Next2025Card key={reward.id} className="p-4">
                      <div className="space-y-4">
                        {/* Reward Info */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                              <Gift className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {reward.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-amber-600 font-bold">
                                <Zap className="h-4 w-4" />
                                {reward.pointsCost} pontos
                              </div>
                              <span className="text-sm text-muted-foreground">
                                • {availableQuantity} disponíveis
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Next2025Button
                          variant={canAfford ? 'primary' : 'secondary'}
                          fullWidth
                          disabled={!canAfford || claimingId === reward.id || availableQuantity === 0}
                          onClick={() => handleClaimReward(reward)}
                        >
                          {claimingId === reward.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Resgatando...
                            </>
                          ) : !canAfford ? (
                            `Faltam ${reward.pointsCost - user.points} pontos`
                          ) : availableQuantity === 0 ? (
                            'Esgotado'
                          ) : (
                            'Resgatar Recompensa'
                          )}
                        </Next2025Button>
                      </div>
                    </Next2025Card>
                  );
                })}
              </div>
            ) : (
              <Next2025EmptyState
                icon={<Gift className="h-8 w-8" />}
                title="Nenhuma recompensa disponível"
                description="As recompensas serão adicionadas em breve"
              />
            )}
          </TabsContent>

          {/* Minhas Recompensas */}
          <TabsContent value="claimed" className="space-y-4">
            {userClaims.length > 0 ? (
              <div className="space-y-3">
                {userClaims.map((claim) => (
                  <Next2025Card key={claim.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{claim.rewardName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Resgatado em {new Date(claim.claimedAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-amber-600 font-medium mt-1">
                          {claim.pointsSpent} pontos gastos
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(claim.status)}
                      </div>
                    </div>
                  </Next2025Card>
                ))}
              </div>
            ) : (
              <Next2025EmptyState
                icon={<Package className="h-8 w-8" />}
                title="Nenhuma recompensa resgatada"
                description="Ganhe pontos e troque por recompensas exclusivas"
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Info Card */}
      <Next2025Card className="p-4 bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900">
        <div className="flex gap-3">
          <Gift className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-pink-900 dark:text-pink-100">
            <p className="font-medium mb-1">Como funciona?</p>
            <ul className="list-disc list-inside space-y-1 text-pink-800 dark:text-pink-200">
              <li>Acumule pontos participando dos eventos</li>
              <li>Troque seus pontos por recompensas físicas</li>
              <li>Retire sua recompensa no local do evento</li>
              <li>Quantidade limitada - primeiro a resgatar, primeiro a receber!</li>
            </ul>
          </div>
        </div>
      </Next2025Card>
    </div>
  );
}
