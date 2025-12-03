-- Enable update by admins on commissions
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_update_commissions ON public.commissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.organization_id = commissions.organization_id
        AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.organization_id = commissions.organization_id
        AND p.role = 'admin'
    )
  );

