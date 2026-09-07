REVOKE ALL ON FUNCTION public.has_purchased(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_review_verified_purchase() FROM PUBLIC, anon, authenticated;