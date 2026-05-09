UPDATE public.stock_news
SET image_url = NULL
WHERE image_url ILIKE '%yahoo_finance_en-US_h_p_finance%'
   OR image_url ILIKE '%yimg.com/rz/stage%';

DELETE FROM public.stock_news a
USING public.stock_news b
WHERE a.external_id = b.external_id
  AND a.external_id IS NOT NULL
  AND a.created_at > b.created_at;

DELETE FROM public.stock_news a
USING public.stock_news b
WHERE lower(a.title) = lower(b.title)
  AND date_trunc('day', a.published_at) = date_trunc('day', b.published_at)
  AND a.created_at > b.created_at;