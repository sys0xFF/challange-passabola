'use client';

import { useEffect, useState } from 'react';
import { useNext2025Auth } from '@/contexts/next2025-auth-context';
import { 
  Next2025Header,
  Next2025Card,
  Next2025ListItem,
  Next2025Loading
} from '@/components/next2025/shared';
import { 
  getTopUsersByPoints,
  getTopUsersByVictories,
  LeaderboardEntry
} from '@/lib/next2025-service';
import { Trophy, Zap, Medal, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeaderboardPage() {
  const { user } = useNext2025Auth();
  const [topByPoints, setTopByPoints] = useState<LeaderboardEntry[]>([]);
  const [topByVictories, setTopByVictories] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'points' | 'victories'>('points');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pointsData, victoriesData] = await Promise.all([
        getTopUsersByPoints(50),
        getTopUsersByVictories(50)
      ]);

      setTopByPoints(pointsData);
      setTopByVictories(victoriesData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number, isCurrentUser: boolean) => {
    if (rank <= 3) {
      return (
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full font-bold
          ${rank === 1 ? 'bg-yellow-500/20 text-yellow-600' : ''}
          ${rank === 2 ? 'bg-gray-400/20 text-gray-600' : ''}
          ${rank === 3 ? 'bg-amber-600/20 text-amber-700' : ''}
        `}>
          {rank}
        </div>
      );
    }

    return (
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
        ${isCurrentUser 
          ? 'bg-purple-500/20 text-purple-600 font-bold' 
          : 'bg-muted text-muted-foreground'
        }
      `}>
        {rank}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Header */}
      <Next2025Header>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-500/10 p-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">Rankings da competição</p>
          </div>
        </div>
      </Next2025Header>

      {loading ? (
        <Next2025Loading message="Carregando rankings..." />
      ) : (
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'points' | 'victories')}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Mais Pontos
            </TabsTrigger>
            <TabsTrigger value="victories" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Mais Vitórias
            </TabsTrigger>
          </TabsList>

          {/* Ranking por Pontos */}
          <TabsContent value="points" className="space-y-4">
            {/* Top 3 Highlights */}
            {topByPoints.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* 2º Lugar */}
                <div className="flex flex-col items-center pt-6">
                  <Medal className="h-8 w-8 text-gray-400 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <p className="font-bold text-lg truncate">{topByPoints[1].userName}</p>
                    <p className="text-xl font-bold text-amber-600">{topByPoints[1].points}</p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </Next2025Card>
                </div>

                {/* 1º Lugar */}
                <div className="flex flex-col items-center">
                  <Crown className="h-10 w-10 text-yellow-500 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-950">
                    <p className="font-bold text-lg truncate">{topByPoints[0].userName}</p>
                    <p className="text-2xl font-bold text-yellow-600">{topByPoints[0].points}</p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </Next2025Card>
                </div>

                {/* 3º Lugar */}
                <div className="flex flex-col items-center pt-6">
                  <Medal className="h-8 w-8 text-amber-600 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-950">
                    <p className="font-bold text-lg truncate">{topByPoints[2].userName}</p>
                    <p className="text-xl font-bold text-amber-700">{topByPoints[2].points}</p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </Next2025Card>
                </div>
              </div>
            )}

            {/* Restante do Ranking */}
            <div className="space-y-2">
              {topByPoints.slice(3).map((entry) => {
                const isCurrentUser = entry.userId === user.id;
                return (
                  <Next2025Card 
                    key={entry.userId} 
                    className={`p-4 ${isCurrentUser ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankBadge(entry.rank, isCurrentUser)}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isCurrentUser ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                          {entry.userName}
                          {isCurrentUser && <span className="ml-2 text-xs">(Você)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.victories} vitória{entry.victories !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-600">{entry.points}</p>
                        <p className="text-xs text-muted-foreground">pontos</p>
                      </div>
                    </div>
                  </Next2025Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Ranking por Vitórias */}
          <TabsContent value="victories" className="space-y-4">
            {/* Top 3 Highlights */}
            {topByVictories.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* 2º Lugar */}
                <div className="flex flex-col items-center pt-6">
                  <Medal className="h-8 w-8 text-gray-400 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <p className="font-bold text-lg truncate">{topByVictories[1].userName}</p>
                    <p className="text-xl font-bold text-emerald-600">{topByVictories[1].victories}</p>
                    <p className="text-xs text-muted-foreground">vitórias</p>
                  </Next2025Card>
                </div>

                {/* 1º Lugar */}
                <div className="flex flex-col items-center">
                  <Crown className="h-10 w-10 text-yellow-500 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-950">
                    <p className="font-bold text-lg truncate">{topByVictories[0].userName}</p>
                    <p className="text-2xl font-bold text-yellow-600">{topByVictories[0].victories}</p>
                    <p className="text-xs text-muted-foreground">vitórias</p>
                  </Next2025Card>
                </div>

                {/* 3º Lugar */}
                <div className="flex flex-col items-center pt-6">
                  <Medal className="h-8 w-8 text-amber-600 mb-2" />
                  <Next2025Card className="w-full p-3 text-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-950">
                    <p className="font-bold text-lg truncate">{topByVictories[2].userName}</p>
                    <p className="text-xl font-bold text-amber-700">{topByVictories[2].victories}</p>
                    <p className="text-xs text-muted-foreground">vitórias</p>
                  </Next2025Card>
                </div>
              </div>
            )}

            {/* Restante do Ranking */}
            <div className="space-y-2">
              {topByVictories.slice(3).map((entry) => {
                const isCurrentUser = entry.userId === user.id;
                return (
                  <Next2025Card 
                    key={entry.userId} 
                    className={`p-4 ${isCurrentUser ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankBadge(entry.rank, isCurrentUser)}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isCurrentUser ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                          {entry.userName}
                          {isCurrentUser && <span className="ml-2 text-xs">(Você)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.points} pontos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600">{entry.victories}</p>
                        <p className="text-xs text-muted-foreground">vitórias</p>
                      </div>
                    </div>
                  </Next2025Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
