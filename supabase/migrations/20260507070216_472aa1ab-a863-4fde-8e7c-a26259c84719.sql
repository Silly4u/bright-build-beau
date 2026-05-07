CREATE TABLE public.stock_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  title text NOT NULL,
  original_title text,
  summary text,
  full_content text,
  source text NOT NULL DEFAULT '',
  url text,
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  ai_translated boolean NOT NULL DEFAULT false,
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_news_symbol_published ON public.stock_news (symbol, published_at DESC);
CREATE INDEX idx_stock_news_published ON public.stock_news (published_at DESC);
CREATE UNIQUE INDEX idx_stock_news_external ON public.stock_news (symbol, external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.stock_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock news" ON public.stock_news FOR SELECT USING (true);
CREATE POLICY "Admins can insert stock news" ON public.stock_news FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update stock news" ON public.stock_news FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete stock news" ON public.stock_news FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));