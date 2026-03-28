-- Create admin role system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Only admins can read user_roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten news_articles: only admins can write
DROP POLICY IF EXISTS "Authenticated users can insert news" ON public.news_articles;
DROP POLICY IF EXISTS "Authenticated users can update news" ON public.news_articles;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON public.news_articles;

CREATE POLICY "Admins can insert news" ON public.news_articles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update news" ON public.news_articles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete news" ON public.news_articles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten contacts: only admins can read
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON public.contacts;
CREATE POLICY "Admins can view contacts" ON public.contacts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten economic_events: only admins can write
DROP POLICY IF EXISTS "Authenticated can insert events" ON public.economic_events;
DROP POLICY IF EXISTS "Authenticated can update events" ON public.economic_events;

CREATE POLICY "Admins can insert events" ON public.economic_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update events" ON public.economic_events FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));