import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">Golden Bingo Live</h3>
            <p className="text-lg">Bringing the joy of bingo to care homes nationwide</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-white hover:text-accent" aria-label="Facebook">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-white hover:text-accent" aria-label="Twitter">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-white hover:text-accent" aria-label="Instagram">
                <span className="material-icons">instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Quick Links</h3>
            <ul className="text-lg space-y-2">
              <li>
                <Link href="/">
                  <a className="hover:text-accent">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/schedule">
                  <a className="hover:text-accent">Game Schedule</a>
                </Link>
              </li>
              <li>
                <Link href="/print-cards">
                  <a className="hover:text-accent">Print Cards</a>
                </Link>
              </li>
              <li>
                <Link href="/order-cards">
                  <a className="hover:text-accent">Order Cards</a>
                </Link>
              </li>
              <li>
                <Link href="/scan-card">
                  <a className="hover:text-accent">Scan Card</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Contact Us</h3>
            <ul className="text-lg space-y-2">
              <li className="flex items-center">
                <span className="material-icons mr-2">phone</span> 0800 123 456
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2">email</span> info@goldenbingolive.com
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2">location_on</span> 123 Bingo Street, London
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-800 text-center">
          <p>&copy; {new Date().getFullYear()} Golden Bingo Live. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;