-- Table: indicator_presets (saved layouts per user)
CREATE TABLE public.indicator_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  pair TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  enabled_indicators TEXT[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_indicator_presets_user ON public.indicator_presets(user_id);

ALTER TABLE public.indicator_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own presets"
  ON public.indicator_presets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own presets"
  ON public.indicator_presets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own presets"
  ON public.indicator_presets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own presets"
  ON public.indicator_presets FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_indicator_presets_updated_at
  BEFORE UPDATE ON public.indicator_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table: indicator_alerts (premium trigger alerts subscription)
CREATE TABLE public.indicator_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pair TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['browser']::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_fired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_indicator_alerts_user ON public.indicator_alerts(user_id);
CREATE INDEX idx_indicator_alerts_active ON public.indicator_alerts(is_active, pair, timeframe);

ALTER TABLE public.indicator_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON public.indicator_alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own alerts"
  ON public.indicator_alerts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON public.indicator_alerts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own alerts"
  ON public.indicator_alerts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all alerts"
  ON public.indicator_alerts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));