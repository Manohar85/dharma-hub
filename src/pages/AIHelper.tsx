import { AIChatbot } from '@/components/ai-assistant/AIChatbot';
import { Home, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AIHelper() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-warm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-display font-bold text-gradient-divine">AI Devotional Assistant</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Introduction */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
              Your Spiritual Guide 🙏
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ask me anything about Hindu spirituality, mantras, slokas, festivals, rituals, or practices. 
              I can help explain the meaning of sacred texts, suggest appropriate mantras for your devotion, 
              and guide you on your spiritual journey.
            </p>
          </div>

          {/* Quick Questions */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="text-lg font-display font-semibold mb-4 text-foreground">
              Try asking:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "What is the meaning of Om Namah Shivaya?",
                "Suggest a mantra for Lord Krishna",
                "Explain the significance of Diwali",
                "What is the Gayatri Mantra?",
                "Tell me about Navratri",
                "How to practice daily meditation?"
              ].map((question, index) => (
                <motion.div
                  key={index}
                  className="bg-primary/10 rounded-xl p-3 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-sm text-foreground">{question}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="relative">
            <AIChatbot />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
