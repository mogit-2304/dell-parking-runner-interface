
import React from 'react';
import { ActivityFeed } from './ActivityFeed';

const AppHeader = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Office Parking</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ActivityFeed />
      </div>
    </header>
  );
};

export default AppHeader;
