import { Link, useLocation } from 'react-router-dom';
import { Home, Music, Video, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  dark?: boolean;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Music, label: 'Music', path: '/music' },
  { icon: Video, label: 'Reels', path: '/reels' },
  { icon: MapPin, label: 'Temples', path: '/temples' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav({ dark = false }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 border-t z-50",
      dark 
        ? "bg-black/80 backdrop-blur border-white/10" 
        : "bg-card border-border glass-warm"
    )}>
      <div className="flex justify-around py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 transition-colors",
                isActive 
                  ? dark ? "text-white" : "text-primary" 
                  : dark ? "text-white/60" : "text-muted-foreground",
                "hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
