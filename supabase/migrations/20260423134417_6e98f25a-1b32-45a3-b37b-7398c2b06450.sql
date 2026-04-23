CREATE TABLE public.morning_briefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_date DATE NOT NULL UNIQUE,
  recap TEXT NOT NULL,
  outlook TEXT NOT NULL,
  scenarios JSONB NOT NULL DEFAULT '[]'::jsonb,
  market_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.morning_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read morning briefs"
ON public.morning_briefs FOR SELECT
USING (true);

CREATE POLICY "Admins can manage morning briefs"
ON public.morning_briefs FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_morning_briefs_updated_at
BEFORE UPDATE ON public.morning_briefs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_morning_briefs_date ON public.morning_briefs(brief_date DESC);