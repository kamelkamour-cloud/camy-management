-- Allow purchases (items) to exist without being tied to a voyage (trip).
-- Some clients buy from boutiques without Camy travelling, and historical
-- purchases from before the app was set up may not map to a trip.
-- The FK is preserved so linking to a trip still cascades on delete.

ALTER TABLE public.items ALTER COLUMN trip_id DROP NOT NULL;
