import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GameSession } from '@/lib/types';

import GameCountdown from '@/components/GameCountdown';
import ActionButtons from '@/components/ActionButtons';
import CardPreview from '@/components/CardPreview';
import GameInformation from '@/components/GameInformation';
import FeaturedImages from '@/components/FeaturedImages';
import UpcomingGames from '@/components/UpcomingGames';

const Home: React.FC = () => {
  const { data: gameSessions, isLoading } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });

  const nextGame = React.useMemo(() => {
    if (!gameSessions || gameSessions.length === 0) {
      return {
        id: 0,
        title: "Regular Game",
        gameTimeGmt: "18:00",
        scheduledDate: new Date().toISOString(),
        specialTheme: "Regular Game",
        prize: "Digital Certificate",
        isActive: true,
        lastNumberCalled: null,
        calledNumbers: [],
        gameStatus: "scheduled" as const
      };
    }

    const now = new Date();

    const upcomingGames = gameSessions.filter(game => {
      const gameDate = new Date(game.scheduledDate);
      const [hours, minutes] = game.gameTimeGmt.split(':').map(Number);
      gameDate.setUTCHours(hours, minutes, 0, 0);
      return gameDate > now;
    });

    return upcomingGames.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return dateA.getTime() - dateB.getTime();
    })[0] || gameSessions[0];
  }, [gameSessions]);

  return (
    <main className="container mx-auto px-4 py-8">
      {!isLoading && nextGame && <GameCountdown nextGame={nextGame} />}

      {/* If ActionButtons contains <Link>, make sure it doesn’t get nested in any other <Link> */}
      <ActionButtons />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <CardPreview />
        <GameInformation />
      </section>

      <FeaturedImages />

      <section className="bg-primary text-white rounded-lg shadow-xl p-8 mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to bring Golden Bingo Live to your care home?
        </h2>
        <p className="text-xl mb-6">
          Join hundreds of care homes across the country providing engaging activities for residents
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          {/* Avoid using <a> inside buttons if buttons are inside links */}
          <button
            className="bg-secondary text-primary hover:bg-yellow-400 font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            onClick={() => window.location.href = '/register'}
          >
            Register Your Care Home
          </button>
          <button
            className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            onClick={() => window.location.href = '/demo'}
          >
            Book a Demo
          </button>
        </div>
      </section>

      <UpcomingGames />
    </main>
  );
};

export default Home;
