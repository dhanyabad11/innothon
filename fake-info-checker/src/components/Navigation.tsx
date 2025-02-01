import React from 'react';
import { Home, Users, Globe, MessageCircle, Settings } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t md:left-0 md:h-screen md:w-64 md:border-r md:border-t-0">
      <div className="flex justify-around p-4 md:flex-col md:h-full md:justify-start md:space-y-6">
        <NavItem icon={<Home />} label="Home" />
        <NavItem icon={<Users />} label="Communities" />
        <NavItem icon={<Globe />} label="Discover" />
        <NavItem icon={<MessageCircle />} label="Messages" />
        <NavItem icon={<Settings />} label="Settings" />
      </div>
    </nav>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <span className="text-gray-700">{icon}</span>
      <span className="hidden md:inline text-gray-700">{label}</span>
    </button>
  );
}