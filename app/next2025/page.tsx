'use client';

import { useEffect, useState } from 'react';
import { useNext2025Auth } from '@/contexts/next2025-auth-context';
import { 
  Next2025Header, 
  Next2025StatsCard, 
  Next2025Card,
  Next2025ListItem,
  Next2025EmptyState,
  Next2025Loading
} from '@/components/next2025/shared';
import { 
  getUserRanking, 
  getUserActivities, 
  Next2025Activity 
} from '@/lib/next2025-service';
import { LogOut, Trophy, Zap, Target, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Next2025HomePage() {
  const { user, logout } = useNext2025Auth();
  const [ranking, setRanking] = useState<{ pointsRank: number; victoriesRank: number; totalUsers: number } | null>(null);
  const [recentActivities, setRecentActivities] = useState<Next2025Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Apenas quando o ID do usuário mudar

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar ranking
      const rankingData = await getUserRanking(user.id);
      setRanking(rankingData);

      // Buscar atividades recentes (últimas 5)
      const activities = await getUserActivities(user.id, 5);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'points_earned':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'victory':
        return <Trophy className="h-5 w-5 text-emerald-500" />;
      case 'band_linked':
        return <Target className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Header */}
      <Next2025Header>
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold">NEXT 2025</h1>
            <p className="text-sm text-muted-foreground">Olá, {user.name.split(' ')[0]}!</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </Next2025Header>

      {loading ? (
        <Next2025Loading message="Carregando seus dados..." />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Next2025StatsCard
              title="Pontos"
              value={user.points}
              icon={<Zap />}
              variant="points"
            />
            <Next2025StatsCard
              title="Vitórias"
              value={user.victories}
              icon={<Trophy />}
              variant="victories"
            />
          </div>

          {/* Ranking Card */}
          {ranking && (
            <Next2025Card gradient className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Seu Ranking
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Por Pontos</p>
                  <p className="text-2xl font-bold">
                    #{ranking.pointsRank}
                    <span className="text-sm text-muted-foreground ml-1">
                      de {ranking.totalUsers}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Por Vitórias</p>
                  <p className="text-2xl font-bold">
                    #{ranking.victoriesRank}
                    <span className="text-sm text-muted-foreground ml-1">
                      de {ranking.totalUsers}
                    </span>
                  </p>
                </div>
              </div>
              <Link 
                href="/next2025/leaderboard"
                className="mt-4 inline-block text-sm font-medium text-black dark:text-white hover:opacity-70"
              >
                Ver ranking completo →
              </Link>
            </Next2025Card>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ações Rápidas</h3>
            <div className="grid gap-3">
              <Link href="/next2025/vincular-pulseira">
                <Next2025Card className="p-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 rounded-full bg-blue-500/10 p-3">
                      <Target className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Vincular Pulseira</p>
                      <p className="text-sm text-muted-foreground">
                        {user.linkedBands && user.linkedBands.length > 0 
                          ? `${user.linkedBands.length} pulseira(s) vinculada(s)`
                          : 'Conecte sua pulseira IoT'
                        }
                      </p>
                    </div>
                  </div>
                </Next2025Card>
              </Link>
              
              <Link href="/next2025/recompensas">
                <Next2025Card className="p-4 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 rounded-full bg-purple-500/10 p-3">
                      <Trophy className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Resgatar Recompensas</p>
                      <p className="text-sm text-muted-foreground">
                        Troque seus pontos por prêmios
                      </p>
                    </div>
                  </div>
                </Next2025Card>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Atividades Recentes</h3>
              <Link 
                href="/next2025/historico"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Ver todas
              </Link>
            </div>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <Next2025ListItem
                    key={activity.id}
                    title={activity.description}
                    subtitle={formatDate(activity.timestamp)}
                    icon={getActivityIcon(activity.type)}
                    value={activity.points ? `+${activity.points}` : undefined}
                  />
                ))}
              </div>
            ) : (
              <Next2025EmptyState
                icon={<Clock className="h-8 w-8" />}
                title="Nenhuma atividade ainda"
                description="Suas atividades aparecerão aqui"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
