CREATE OR REPLACE FUNCTION public.has_purchased(_user_id uuid, _product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o,
         LATERAL jsonb_array_elements(o.items) AS item
    WHERE o.user_id = _user_id
      AND o.status <> 'cancelled'
      AND (item ->> 'product_id') = _product_id::text
  )
$$;

CREATE OR REPLACE FUNCTION public.set_review_verified_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.is_verified_purchase := public.has_purchased(NEW.user_id, NEW.product_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_set_verified_purchase ON public.reviews;
CREATE TRIGGER reviews_set_verified_purchase
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_review_verified_purchase();