import React from 'react';
import { Navigation } from './components/Navigation';
import { CreatePost } from './components/CreatePost';
import { Feed } from './components/Feed';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="md:ml-64 p-4">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Inclusive Space</h1>
            <p className="text-gray-600">Connect, Share, and Celebrate Diversity</p>
          </header>

          <CreatePost />
          <Feed />
        </div>
      </main>
    </div>
  );
}

export default App;