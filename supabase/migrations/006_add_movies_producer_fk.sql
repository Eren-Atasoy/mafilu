-- Add FK if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'movies_producer_id_fkey') THEN
    ALTER TABLE movies
    ADD CONSTRAINT movies_producer_id_fkey
    FOREIGN KEY (producer_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;
