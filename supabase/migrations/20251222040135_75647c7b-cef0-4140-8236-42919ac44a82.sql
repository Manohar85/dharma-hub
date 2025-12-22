-- Create daily_mantras table for storing mantras
CREATE TABLE public.daily_mantras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sanskrit_text TEXT NOT NULL,
  transliteration TEXT,
  meaning TEXT,
  deity public.deity DEFAULT 'other',
  day_of_week INTEGER, -- 0-6 for Sunday-Saturday, NULL for any day
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_mantras ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Mantras are viewable by everyone"
ON public.daily_mantras
FOR SELECT
USING (true);

-- Insert sample mantras
INSERT INTO public.daily_mantras (sanskrit_text, transliteration, meaning, deity, day_of_week) VALUES
('ॐ नमः शिवाय', 'Om Namah Shivaya', 'I bow to Lord Shiva, the auspicious one', 'shiva', 1),
('ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namaha', 'Salutations to Lord Ganesha, remover of obstacles', 'ganesh', 0),
('हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे', 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare', 'Glory to Lord Krishna', 'krishna', 2),
('ॐ श्री महालक्ष्म्यै नमः', 'Om Shri Mahalakshmyai Namaha', 'Salutations to Goddess Lakshmi, bestower of prosperity', 'lakshmi', 5),
('ॐ ऐं सरस्वत्यै नमः', 'Om Aim Saraswatyai Namaha', 'Salutations to Goddess Saraswati, goddess of wisdom', 'saraswati', 4),
('ॐ हनुमते नमः', 'Om Hanumate Namaha', 'Salutations to Lord Hanuman, symbol of strength and devotion', 'hanuman', 6),
('ॐ नमो नारायणाय', 'Om Namo Narayanaya', 'I bow to Lord Vishnu, the preserver', 'vishnu', 3);

-- Insert sample temples if table is empty
INSERT INTO public.temples (name, state, deity, description, address, district)
SELECT * FROM (VALUES
  ('Kashi Vishwanath Temple', 'uttar_pradesh'::indian_state, 'shiva'::deity, 'One of the most famous Hindu temples dedicated to Lord Shiva', 'Varanasi, Uttar Pradesh', 'Varanasi'),
  ('Tirupati Balaji Temple', 'andhra_pradesh'::indian_state, 'vishnu'::deity, 'The richest and most visited temple in the world', 'Tirumala Hills, Andhra Pradesh', 'Chittoor'),
  ('Meenakshi Temple', 'tamil_nadu'::indian_state, 'durga'::deity, 'Historic Hindu temple dedicated to Goddess Meenakshi', 'Madurai, Tamil Nadu', 'Madurai'),
  ('Somnath Temple', 'gujarat'::indian_state, 'shiva'::deity, 'First among the twelve Jyotirlinga shrines of Shiva', 'Prabhas Patan, Gujarat', 'Gir Somnath'),
  ('Siddhivinayak Temple', 'maharashtra'::indian_state, 'ganesh'::deity, 'Famous temple dedicated to Lord Ganesha', 'Mumbai, Maharashtra', 'Mumbai')
) AS t(name, state, deity, description, address, district)
WHERE NOT EXISTS (SELECT 1 FROM public.temples LIMIT 1);