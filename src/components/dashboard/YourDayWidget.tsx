import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getDailySpiritualMessage } from '@/lib/ai-service';
import { useEffect, useState } from 'react';

interface YourDayWidgetProps {
  deity: string;
  name: string;
}

export function YourDayWidget({ deity, name }: YourDayWidgetProps) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessage() {
      try {
        const dailyMessage = await getDailySpiritualMessage(deity);
        setMessage(dailyMessage);
      } catch (error) {
        setMessage("May this day bring you peace, joy, and spiritual growth. 🙏");
      } finally {
        setLoading(false);
      }
    }
    loadMessage();
  }, [deity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-gold/10 to-accent/10 border-primary/20 shadow-gold">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full gradient-divine flex items-center justify-center shadow-warm"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sun className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">Your Day, {name}</h3>
              <p className="text-sm text-muted-foreground">Spiritual guidance for today</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            </div>
          ) : (
            <motion.p
              className="text-foreground/90 leading-relaxed text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Personalized for you</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
