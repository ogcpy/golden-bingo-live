import React from 'react';
import { Link } from 'wouter';

const ActionButtons: React.FC = () => {
  return (
    <section className="mb-12">
      <div className="action-buttons grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Print Cards Button */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary p-4">
            <h3 className="text-center text-primary text-2xl font-bold">PRINT CARDS</h3>
          </div>
          <div className="p-6 text-center">
            <span className="material-icons text-primary text-6xl mb-4">print</span>
            <p className="text-xl mb-4">Print bingo cards for your residents</p>
            <Link href="/print-cards">
              <a className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors inline-block">
                Print Cards
              </a>
            </Link>
          </div>
        </div>

        {/* Order Cards Button */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary p-4">
            <h3 className="text-center text-primary text-2xl font-bold">ORDER CARDS</h3>
          </div>
          <div className="p-6 text-center">
            <span className="material-icons text-primary text-6xl mb-4">shopping_cart</span>
            <p className="text-xl mb-4">Order pre-printed cards for delivery</p>
            <Link href="/order-cards">
              <a className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors inline-block">
                Order Now
              </a>
            </Link>
          </div>
        </div>

        {/* Scan Winner Button */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary p-4">
            <h3 className="text-center text-primary text-2xl font-bold">SCAN WINNING CARD</h3>
          </div>
          <div className="p-6 text-center">
            <span className="material-icons text-primary text-6xl mb-4">qr_code_scanner</span>
            <p className="text-xl mb-4">Scan QR code to verify winners</p>
            <Link href="/scan-card">
              <a className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors inline-block">
                Scan Now
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionButtons;
