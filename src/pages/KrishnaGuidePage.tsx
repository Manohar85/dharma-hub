import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, RefreshCw, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import KrishnaAvatar from "@/components/krishna/KrishnaAvatar";
import { BottomNav } from "@/components/navigation/BottomNav";

// Wisdom teachings from Bhagavad Gita
const KRISHNA_TEACHINGS = [
  "Karmanye vadhikaraste, Ma phaleshu kadachana - You have the right to work, but never to its fruits.",
  "Yoga is the journey of the self, through the self, to the self.",
  "The soul is neither born, and nor does it die. It is unborn, eternal, ever-existing and primeval.",
  "Set thy heart upon thy work, but never on its reward.",
  "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
  "A person can rise through the efforts of their own mind; they can also degrade themselves.",
  "The wise see that there is action in the midst of inaction and inaction in the midst of action.",
  "Be steadfast in your duty, O Arjuna, and abandon all attachment to success or failure.",
];

const KrishnaGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTeaching, setCurrentTeaching] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getRandomTeaching = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * KRISHNA_TEACHINGS.length);
    setCurrentTeaching(KRISHNA_TEACHINGS[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomTeaching();
  }, [getRandomTeaching]);

  const askKrishna = async () => {
    if (!userQuestion.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: userQuestion }],
          type: "krishna-guidance",
        },
      });

      if (error) throw error;
      
      const response = data?.choices?.[0]?.message?.content || 
        "Dear child, contemplate deeply on your question. The answer lies within your own heart.";
      
      setCurrentTeaching(response);
      setUserQuestion("");
    } catch (error) {
      console.error("Failed to get Krishna's guidance:", error);
      setCurrentTeaching("Peace be upon you. Sometimes silence holds the greatest wisdom.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900 pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-amber-200/50 dark:border-amber-800/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-amber-700 dark:text-amber-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            Krishna's Wisdom
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={getRandomTeaching}
            className="text-amber-700 dark:text-amber-300"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8">
        {/* Decorative Elements */}
        <motion.div
          className="absolute top-20 left-4 text-amber-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-8 text-orange-400/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>

        {/* Krishna Avatar with Voice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <KrishnaAvatar
            message={currentTeaching}
            autoSpeak={false}
            onSpeakingChange={setIsSpeaking}
          />
        </motion.div>

        {/* Speaking Status */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-3 bg-amber-500 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm">Krishna is speaking...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ask Krishna Section */}
        <motion.div
          className="w-full max-w-md mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/60 dark:bg-amber-900/40 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200/50 dark:border-amber-700/50">
            <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Ask Krishna for Guidance
            </h3>
            <div className="flex gap-2">
              <Input
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="What troubles your mind, dear one?"
                className="bg-white/80 dark:bg-amber-800/40 border-amber-300 dark:border-amber-600 focus:ring-amber-500"
                onKeyDown={(e) => e.key === "Enter" && askKrishna()}
              />
              <Button
                onClick={askKrishna}
                disabled={isLoading || !userQuestion.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Ask"
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Daily Teachings */}
        <motion.div
          className="w-full max-w-md mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-3 text-center">
            Teachings from the Bhagavad Gita
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Karma", "Dharma", "Bhakti", "Jnana"].map((topic, index) => (
              <motion.button
                key={topic}
                className="p-3 bg-white/50 dark:bg-amber-800/30 rounded-xl text-center text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors border border-amber-200/50 dark:border-amber-700/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const teachings: Record<string, string> = {
                    Karma: "Work done as a sacrifice for the Supreme Lord must be performed, otherwise work causes bondage in this material world.",
                    Dharma: "It is better to perform one's own duty imperfectly than to perform another's duty perfectly.",
                    Bhakti: "Those who worship Me with devotion, meditating on My transcendental form, to them I carry what they lack and preserve what they have.",
                    Jnana: "There is no purifier like knowledge in this world. One who becomes mature in yoga finds this knowledge within himself in due course.",
                  };
                  setCurrentTeaching(teachings[topic]);
                }}
              >
                {topic} Yoga
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default KrishnaGuidePage;
