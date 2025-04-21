import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { GameSession } from '@/lib/types';
import { formatDate, convertGmtToLocal } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Award, AlertCircle } from 'lucide-react';

const Schedule: React.FC = () => {
  const { data: gameSessions, isLoading, error } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });

  // Group sessions by date for better organization
  const groupedSessions = React.useMemo(() => {
    if (!gameSessions) return {};

    return gameSessions.reduce((acc: Record<string, GameSession[]>, session) => {
      const date = new Date(session.scheduledDate).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {});
  }, [gameSessions]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Game Schedule</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-xl">Loading game schedule...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !gameSessions) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Game Schedule</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-xl text-red-500">Failed to load game schedule</p>
            <p className="mt-2">Please try again later or contact support.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Game Schedule</h1>
      
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upcoming Games Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px] text-lg">Date</TableHead>
                    <TableHead className="text-lg">Game Time (GMT)</TableHead>
                    <TableHead className="text-lg">Local Time</TableHead>
                    <TableHead className="text-lg">Game Theme</TableHead>
                    <TableHead className="text-lg">Prize</TableHead>
                    <TableHead className="text-lg text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-lg">
                        No upcoming games scheduled
                      </TableCell>
                    </TableRow>
                  ) : (
                    gameSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium text-lg">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={20} className="text-primary" />
                            {formatDate(session.scheduledDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-lg">
                          <div className="flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            {session.gameTimeGmt}
                          </div>
                        </TableCell>
                        <TableCell className="text-lg">
                          {convertGmtToLocal(session.gameTimeGmt)}
                        </TableCell>
                        <TableCell className="text-lg">
                          {session.specialTheme || "Regular Game"}
                        </TableCell>
                        <TableCell className="text-lg">
                          <div className="flex items-center gap-2">
                            <Award size={20} className="text-secondary" />
                            {session.prize || "Digital Certificate"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/live-game/${session.id}`}>
                              <Button className="bg-primary hover:bg-blue-800 text-white font-bold">
                                View Game
                              </Button>
                            </Link>
                            <Link href={`/print-cards?game=${session.id}`}>
                              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                                Print Cards
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Schedule Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-primary">Regular Games</h3>
                <ul className="list-disc pl-5 text-lg space-y-2">
                  <li>We host bingo games every day at 18:00 GMT</li>
                  <li>Special afternoon games are available on weekends</li>
                  <li>All games can be accessed through your TV or tablet</li>
                  <li>Each game lasts approximately 45-60 minutes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2 text-primary">Special Events</h3>
                <ul className="list-disc pl-5 text-lg space-y-2">
                  <li>Holiday-themed games with special prizes</li>
                  <li>Monthly tournaments between care homes</li>
                  <li>Seasonal celebrations with enhanced prize pools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Preparing for Game Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-primary">Before the Game</h3>
                <ol className="list-decimal pl-5 text-lg space-y-2">
                  <li>Print or order bingo cards at least 24 hours in advance</li>
                  <li>Set up a TV or large tablet in your common room</li>
                  <li>Distribute cards to residents 15-30 minutes before start</li>
                  <li>Test your internet connection</li>
                </ol>
              </div>
              
              <div className="flex justify-center gap-4">
                <Link href="/print-cards">
                  <Button className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-6 rounded-lg text-lg">
                    Print Cards
                  </Button>
                </Link>
                <Link href="/order-cards">
                  <Button className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg">
                    Order Cards
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-8">
        <Card className="bg-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to suggest a game time?</h2>
            <p className="text-xl mb-6">We're always looking to improve our schedule to suit our care home partners</p>
            <Button className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-8 rounded-lg text-xl">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Schedule;
