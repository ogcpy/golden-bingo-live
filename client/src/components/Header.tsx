import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary/90 backdrop-blur-sm border-b border-primary/20 text-primary-foreground py-4 px-2 sm:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Golden Bingo Live" className="h-16 w-auto" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">Golden Bingo Live</h1>
        </Link>

        <div className="hidden sm:flex items-center space-x-6">
          <Link
            href="/schedule"
            className={cn(
              "text-xl hover:text-accent transition-colors",
              location === "/schedule" && "text-accent"
            )}
          >
            Schedule
          </Link>
          <Link
            href="/print-cards"
            className={cn(
              "text-xl hover:text-accent transition-colors",
              location === "/print-cards" && "text-accent"
            )}
          >
            Print Cards
          </Link>
          <Link
            href="/order-cards"
            className={cn(
              "text-xl hover:text-accent transition-colors",
              location === "/order-cards" && "text-accent"
            )}
          >
            Order Cards
          </Link>
          <Link
            href="/scan-card"
            className={cn(
              "text-xl hover:text-accent transition-colors",
              location === "/scan-card" && "text-accent"
            )}
          >
            Scan Card
          </Link>
        </div>

        <button 
          className="sm:hidden text-white z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-icons text-3xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full right-0 w-full bg-primary text-white py-4 px-2 shadow-lg z-10">
            <div className="flex flex-col space-y-4">
              <Link
                href="/schedule"
                className={cn(
                  "text-xl py-2 px-4 hover:bg-blue-800 hover:text-accent transition-colors",
                  location === "/schedule" && "text-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                href="/print-cards"
                className={cn(
                  "text-xl py-2 px-4 hover:bg-blue-800 hover:text-accent transition-colors",
                  location === "/print-cards" && "text-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Print Cards
              </Link>
              <Link
                href="/order-cards"
                className={cn(
                  "text-xl py-2 px-4 hover:bg-blue-800 hover:text-accent transition-colors",
                  location === "/order-cards" && "text-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Order Cards
              </Link>
              <Link
                href="/scan-card"
                className={cn(
                  "text-xl py-2 px-4 hover:bg-blue-800 hover:text-accent transition-colors",
                  location === "/scan-card" && "text-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Scan Card
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;