import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Music, Video, FileText, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'music' | 'reel' | 'post' | 'temple' | 'mantra';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  link: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Sample searchable content - in production, this would come from the database
const SEARCHABLE_CONTENT: SearchResult[] = [
  { id: '1', type: 'music', title: 'Om Namah Shivaya', subtitle: 'Devotional Chant', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '2', type: 'music', title: 'Gayatri Mantra', subtitle: 'Sacred Vedic Hymn', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '3', type: 'music', title: 'Hanuman Chalisa', subtitle: 'Lord Hanuman', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '4', type: 'music', title: 'Sri Venkateswara Suprabhatam', subtitle: 'Morning Prayer', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '5', type: 'reel', title: 'Morning Aarti at Varanasi', subtitle: 'Spiritual Video', icon: <Video className="w-4 h-4" />, link: '/reels' },
  { id: '6', type: 'reel', title: 'Temple Tour - Tirupati', subtitle: 'Temple Video', icon: <Video className="w-4 h-4" />, link: '/reels' },
  { id: '7', type: 'temple', title: 'Tirupati Balaji Temple', subtitle: 'Andhra Pradesh', icon: <MapPin className="w-4 h-4" />, link: '/temples' },
  { id: '8', type: 'temple', title: 'Meenakshi Temple', subtitle: 'Tamil Nadu', icon: <MapPin className="w-4 h-4" />, link: '/temples' },
  { id: '9', type: 'temple', title: 'Siddhivinayak Temple', subtitle: 'Maharashtra', icon: <MapPin className="w-4 h-4" />, link: '/temples' },
  { id: '10', type: 'mantra', title: 'Maha Mrityunjaya Mantra', subtitle: 'Lord Shiva', icon: <FileText className="w-4 h-4" />, link: '/ai-helper' },
  { id: '11', type: 'mantra', title: 'Lakshmi Gayatri', subtitle: 'Goddess Lakshmi', icon: <FileText className="w-4 h-4" />, link: '/ai-helper' },
  { id: '12', type: 'music', title: 'Krishna Bhajan Collection', subtitle: 'Lord Krishna', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '13', type: 'music', title: 'Durga Stuti', subtitle: 'Goddess Durga', icon: <Music className="w-4 h-4" />, link: '/music' },
  { id: '14', type: 'reel', title: 'Ganesh Chaturthi Celebrations', subtitle: 'Festival Video', icon: <Video className="w-4 h-4" />, link: '/reels' },
  { id: '15', type: 'temple', title: 'Kashi Vishwanath Temple', subtitle: 'Uttar Pradesh', icon: <MapPin className="w-4 h-4" />, link: '/temples' },
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate async search - in production, this would be an API call
    setTimeout(() => {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const filtered = SEARCHABLE_CONTENT.filter(item => 
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle?.toLowerCase().includes(normalizedQuery) ||
        item.type.toLowerCase().includes(normalizedQuery)
      );
      setResults(filtered);
      setIsSearching(false);
    }, 100);
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'music': return 'bg-primary/10 text-primary';
      case 'reel': return 'bg-accent/10 text-accent';
      case 'temple': return 'bg-gold/10 text-gold';
      case 'mantra': return 'bg-temple/10 text-temple';
      case 'post': return 'bg-warm/10 text-warm';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search music, mantras, temples, reels..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 rounded-xl bg-card border-border focus:border-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="max-h-80 overflow-y-auto shadow-lg">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      to={result.link}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for music, mantras, or temples</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && query && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
