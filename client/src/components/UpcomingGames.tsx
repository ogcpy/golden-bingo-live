import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { GameSession } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';

const UpcomingGames: React.FC = () => {
  const { data: gameSessions, isLoading, error } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-primary">Upcoming Games Schedule</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-lg">Loading upcoming games...</p>
        </div>
      </section>
    );
  }

  if (error || !gameSessions) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-primary">Upcoming Games Schedule</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-lg text-red-500">Failed to load game schedule</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-primary">Upcoming Games Schedule</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-4 px-6 text-left text-xl">Date</th>
              <th className="py-4 px-6 text-left text-xl">Time (GMT)</th>
              <th className="py-4 px-6 text-left text-xl">Special Theme</th>
              <th className="py-4 px-6 text-left text-xl">Prize</th>
              <th className="py-4 px-6 text-center text-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {gameSessions.map((session) => (
              <tr key={session.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6 text-lg">{formatRelativeDate(session.scheduledDate)}</td>
                <td className="py-4 px-6 text-lg">{session.gameTimeGmt}</td>
                <td className="py-4 px-6 text-lg">{session.specialTheme || "Regular Game"}</td>
                <td className="py-4 px-6 text-lg">{session.prize || "Digital Certificate"}</td>
                <td className="py-4 px-6 text-center">
                  <Link href={`/live-game/${session.id}`}>
                    <a className="inline-block bg-secondary text-primary hover:bg-yellow-500 font-bold py-2 px-4 rounded text-lg transition-colors">
                      View Game
                    </a>
                  </Link>
                </td>
              </tr>
            ))}
            
            {gameSessions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-lg">
                  No upcoming games scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UpcomingGames;
