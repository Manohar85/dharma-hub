import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, showBack = true }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass-warm border-b border-border">
      <div className="flex items-center gap-4 p-4">
        {showBack && (
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
