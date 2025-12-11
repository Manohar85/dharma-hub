import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INDIAN_STATES, LANGUAGES, DEITIES } from '@/lib/constants';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { cn } from '@/lib/utils';

type Step = 'welcome' | 'state' | 'language' | 'deity' | 'complete';

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const { preferences, updatePreferences, completeOnboarding } = useUserPreferences();

  const steps: Step[] = ['welcome', 'state', 'language', 'deity', 'complete'];
  const currentIndex = steps.indexOf(step);

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <div className="min-h-screen gradient-cream flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
        <motion.div
          className="h-full gradient-saffron"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <WelcomeStep key="welcome" onNext={goNext} />
          )}
          {step === 'state' && (
            <StateStep
              key="state"
              selected={preferences.state}
              onSelect={(state) => updatePreferences({ state })}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'language' && (
            <LanguageStep
              key="language"
              selected={preferences.language}
              onSelect={(language) => updatePreferences({ language })}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'deity' && (
            <DeityStep
              key="deity"
              selected={preferences.deity}
              onSelect={(deity) => updatePreferences({ deity })}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'complete' && (
            <CompleteStep key="complete" onComplete={handleComplete} onBack={goBack} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center max-w-md"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-8 rounded-full gradient-divine flex items-center justify-center shadow-gold animate-glow"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-5xl">🕉️</span>
      </motion.div>
      
      <h1 className="text-4xl font-display font-bold text-foreground mb-4">
        Welcome to <span className="text-gradient-divine">Bhakti</span>
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Connect with devotees, explore temples, and immerse yourself in devotional music from across India.
      </p>

      <Button
        onClick={onNext}
        className="w-full h-14 text-lg font-semibold gradient-saffron hover:opacity-90 transition-opacity shadow-warm"
      >
        Begin Your Journey
        <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </motion.div>
  );
}

interface StepProps {
  selected: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function StateStep({ selected, onSelect, onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md"
    >
      <h2 className="text-2xl font-display font-bold text-center mb-2">Where are you from?</h2>
      <p className="text-muted-foreground text-center mb-6">
        We'll personalize your content based on your region
      </p>

      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
        {INDIAN_STATES.map((state) => (
          <motion.button
            key={state.value}
            onClick={() => onSelect(state.value)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all text-left',
              selected === state.value
                ? 'border-primary bg-primary/10 shadow-warm'
                : 'border-border bg-card hover:border-primary/50'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mb-2 block">{state.icon}</span>
            <span className="font-medium text-sm">{state.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 h-12 gradient-saffron shadow-warm"
        >
          Continue
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function LanguageStep({ selected, onSelect, onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md"
    >
      <h2 className="text-2xl font-display font-bold text-center mb-2">Choose your language</h2>
      <p className="text-muted-foreground text-center mb-6">
        See content in your preferred language
      </p>

      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.value}
            onClick={() => onSelect(lang.value)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all text-left',
              selected === lang.value
                ? 'border-primary bg-primary/10 shadow-warm'
                : 'border-border bg-card hover:border-primary/50'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mb-2 block">{lang.icon}</span>
            <span className="font-medium text-sm">{lang.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 h-12 gradient-saffron shadow-warm"
        >
          Continue
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function DeityStep({ selected, onSelect, onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md"
    >
      <h2 className="text-2xl font-display font-bold text-center mb-2">Your Ishta Devata</h2>
      <p className="text-muted-foreground text-center mb-6">
        Select your favorite deity for personalized content
      </p>

      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
        {DEITIES.map((deity) => (
          <motion.button
            key={deity.value}
            onClick={() => onSelect(deity.value)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all text-left',
              selected === deity.value
                ? 'border-primary bg-primary/10 shadow-warm'
                : 'border-border bg-card hover:border-primary/50'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl mb-2 block">{deity.icon}</span>
            <span className="font-medium text-sm">{deity.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 h-12 gradient-saffron shadow-warm"
        >
          Continue
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function CompleteStep({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center max-w-md"
    >
      <motion.div
        className="w-28 h-28 mx-auto mb-8 rounded-full gradient-divine flex items-center justify-center shadow-gold"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-14 h-14 text-primary-foreground" />
      </motion.div>

      <h2 className="text-3xl font-display font-bold text-foreground mb-4">
        You're All Set! 🙏
      </h2>

      <p className="text-lg text-muted-foreground mb-8">
        Your personalized devotional experience awaits. Explore temples, music, and connect with fellow devotees.
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-14">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          onClick={onComplete}
          className="flex-1 h-14 text-lg font-semibold gradient-divine shadow-gold hover:opacity-90 transition-opacity"
        >
          Enter Bhakti
          <Sparkles className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
