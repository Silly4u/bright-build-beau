
CREATE TABLE public.kol_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  telegram TEXT,
  channel_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  followers INTEGER,
  audience_vn_percent INTEGER,
  experience TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kol_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit KOL application"
  ON public.kol_applications FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view KOL applications"
  ON public.kol_applications FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Admins can update KOL applications"
  ON public.kol_applications FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));
