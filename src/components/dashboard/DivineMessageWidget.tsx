import { motion } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getDevotionalQuote } from '@/lib/ai-service';
import { useEffect, useState } from 'react';
import { DEITIES } from '@/lib/constants';

interface DivineMessageWidgetProps {
  deity: string;
}

export function DivineMessageWidget({ deity }: DivineMessageWidgetProps) {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const deityInfo = DEITIES.find(d => d.value === deity);

  useEffect(() => {
    async function loadQuote() {
      try {
        const devotionalQuote = await getDevotionalQuote(deity);
        setQuote(devotionalQuote);
      } catch (error) {
        setQuote("The divine presence is always with you, guiding and protecting your path. 🙏");
      } finally {
        setLoading(false);
      }
    }
    loadQuote();
  }, [deity]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-temple/10 via-accent/10 to-primary/10 border-temple/20 shadow-gold">
        <div className="absolute top-0 right-0 w-40 h-40 bg-temple/5 rounded-full blur-3xl animate-pulse-warm" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-warm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Divine Message</h3>
              <p className="text-xs text-muted-foreground">{deityInfo?.label || 'Devotional'}</p>
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
            {loading ? (
              <div className="space-y-2 pl-6">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            ) : (
              <motion.blockquote
                className="text-base text-foreground/90 leading-relaxed pl-6 italic font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{quote}"
              </motion.blockquote>
            )}
            <Quote className="absolute -bottom-2 -right-2 w-8 h-8 text-primary/20 rotate-180" />
          </div>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-4xl animate-float">{deityInfo?.icon || '🕉️'}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
