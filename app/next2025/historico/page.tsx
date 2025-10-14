'use client';

import { useEffect, useState } from 'react';
import { useNext2025Auth } from '@/contexts/next2025-auth-context';
import {
  Next2025Header,
  Next2025Card,
  Next2025ListItem,
  Next2025EmptyState,
  Next2025Loading
} from '@/components/next2025/shared';
import {
  getUserActivities,
  Next2025Activity
} from '@/lib/next2025-service';
import { History, Zap, Trophy, Link as LinkIcon, Gift, CheckCircle2, Calendar } from 'lucide-react';

export default function HistoricoPage() {
  const { user } = useNext2025Auth();
  const [activities, setActivities] = useState<Next2025Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'points' | 'victories' | 'other'>('all');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserActivities(user.id);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'points_earned':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'victory':
        return <Trophy className="h-5 w-5 text-emerald-500" />;
      case 'band_linked':
        return <LinkIcon className="h-5 w-5 text-blue-500" />;
      case 'reward_redeemed':
        return <Gift className="h-5 w-5 text-pink-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'points_earned':
        return 'text-amber-600';
      case 'victory':
        return 'text-emerald-600';
      case 'band_linked':
        return 'text-blue-600';
      case 'reward_redeemed':
        return 'text-pink-600';
      default:
        return 'text-purple-600';
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
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} dias atrás`;
      } else {
        return date.toLocaleDateString('pt-BR');
      }
    }
  };

  const getFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'points') return activity.type === 'points_earned';
    if (filter === 'victories') return activity.type === 'victory';
    if (filter === 'other') return !['points_earned', 'victory'].includes(activity.type);
    return true;
  });

  // Agrupar atividades por data
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ontem';
    } else {
      groupKey = date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(activity);
    return groups;
  }, {} as Record<string, Next2025Activity[]>);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Header */}
      <Next2025Header>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-500/10 p-2">
            <History className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Histórico</h1>
            <p className="text-sm text-muted-foreground">
              {activities.length} atividade{activities.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </Next2025Header>

      {loading ? (
        <Next2025Loading message="Carregando histórico..." />
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Todas ({activities.length})
            </button>
            <button
              onClick={() => setFilter('points')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'points'
                  ? 'bg-amber-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Pontos ({activities.filter(a => a.type === 'points_earned').length})
            </button>
            <button
              onClick={() => setFilter('victories')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'victories'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Vitórias ({activities.filter(a => a.type === 'victory').length})
            </button>
            <button
              onClick={() => setFilter('other')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'other'
                  ? 'bg-purple-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Outros ({activities.filter(a => !['points_earned', 'victory'].includes(a.type)).length})
            </button>
          </div>

          {/* Activities */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center gap-2 px-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                      {date}
                    </h3>
                  </div>

                  {/* Activities for this date */}
                  <div className="space-y-2">
                    {dateActivities.map((activity) => (
                      <Next2025Card key={activity.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 rounded-full bg-background p-2">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1" title={getFullDate(activity.timestamp)}>
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                          {activity.points !== undefined && activity.points !== 0 && (
                            <div className={`flex-shrink-0 text-lg font-bold ${getActivityColor(activity.type)}`}>
                              {activity.points > 0 ? '+' : ''}{activity.points}
                            </div>
                          )}
                        </div>
                      </Next2025Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Next2025EmptyState
              icon={<History className="h-8 w-8" />}
              title={filter === 'all' ? 'Nenhuma atividade ainda' : 'Nenhuma atividade encontrada'}
              description={
                filter === 'all'
                  ? 'Suas atividades aparecerão aqui'
                  : 'Tente alterar o filtro'
              }
            />
          )}
        </>
      )}
    </div>
  );
}
