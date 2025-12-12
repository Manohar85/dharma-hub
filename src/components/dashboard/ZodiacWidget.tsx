import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ZODIAC_SIGNS } from '@/lib/constants';

interface ZodiacWidgetProps {
  zodiacSign: string;
}

export function ZodiacWidget({ zodiacSign }: ZodiacWidgetProps) {
  const sign = ZODIAC_SIGNS.find(s => s.value === zodiacSign) || ZODIAC_SIGNS.find(s => s.value === 'leo')!;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-gold/10 via-primary/10 to-warm/10 border-gold/30 shadow-warm">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gold/10 rounded-full blur-2xl animate-pulse-warm" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-14 h-14 rounded-full gradient-divine flex items-center justify-center shadow-gold text-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {sign.icon}
              </motion.div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">{sign.label}</h3>
                <p className="text-xs text-muted-foreground">{sign.dates}</p>
              </div>
            </div>
            <Star className="w-5 h-5 text-gold" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Your Zodiac Sign</span>
            </div>
            <p className="text-sm text-foreground/80 mt-3">
              Your cosmic energy aligns with {sign.label}'s bold and radiant nature. 
              Embrace your natural leadership and let your inner light shine brightly today. ✨
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
