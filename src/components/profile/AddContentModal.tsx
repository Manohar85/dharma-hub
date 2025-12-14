import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, FileText, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DEITIES, LANGUAGES } from '@/lib/constants';

interface AddContentModalProps {
  type: 'music' | 'post';
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddContentModal({ type, isOpen, onClose, onSuccess }: AddContentModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deity: '',
    language: '',
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call - in production, this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: `${type === 'music' ? 'Music' : 'Post'} added!`,
        description: "Your content has been submitted successfully.",
      });
      
      onSuccess?.();
      onClose();
      setFormData({ title: '', description: '', deity: '', language: '', file: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-md md:w-full"
          >
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-divine flex items-center justify-center">
                    {type === 'music' ? (
                      <Music className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold">
                      Add {type === 'music' ? 'Music' : 'Post'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Share with the community
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder={type === 'music' ? 'Enter song title' : 'Enter post title'}
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deity</Label>
                    <Select
                      value={formData.deity}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, deity: value }))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select deity" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEITIES.map((deity) => (
                          <SelectItem key={deity.value} value={deity.value}>
                            <span className="flex items-center gap-2">
                              <span>{deity.icon}</span>
                              <span>{deity.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">
                    {type === 'music' ? 'Audio File' : 'Image/Video'}
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="file"
                      className="hidden"
                      accept={type === 'music' ? 'audio/*' : 'image/*,video/*'}
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="file"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      {formData.file ? (
                        <span className="text-sm text-foreground font-medium">
                          {formData.file.name}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm text-foreground">
                            Click to upload
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {type === 'music' ? 'MP3, WAV, AAC' : 'JPG, PNG, MP4'}
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full gradient-saffron"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Add ${type === 'music' ? 'Music' : 'Post'}`
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
