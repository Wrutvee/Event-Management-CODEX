import React from 'react';
import Header from '../components/Header';
import HelpMenu from '../components/HelpMenu';

function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <HelpMenu isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}

export default HelpPage;