-- ===========================
-- PATCH : alignement entités
-- ===========================

-- 1) USERS : name -> last_name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='t_users' AND column_name='name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='t_users' AND column_name='last_name'
  ) THEN
    EXECUTE 'ALTER TABLE t_users RENAME COLUMN name TO last_name';
  END IF;
END$$;

-- 2) LANDS : colonne manquante 'complet'
ALTER TABLE t_lands
  ADD COLUMN IF NOT EXISTS complet BOOLEAN NOT NULL DEFAULT FALSE;

-- 3) GARDENS : (tes ALTER existent déjà ; on sécurise en IF NOT EXISTS + rename idempotent)
ALTER TABLE t_gardens
  ADD COLUMN IF NOT EXISTS price NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS garden_img TEXT,
  ADD COLUMN IF NOT EXISTS garden_name TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='t_gardens' AND column_name='designation'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='t_gardens' AND column_name='garden_desc'
  ) THEN
    EXECUTE 'ALTER TABLE t_gardens RENAME COLUMN designation TO garden_desc';
  END IF;
END$$;

-- 4) GARDEN_RESERVATIONS : renommer land_id -> garden_id + ajouter owner_id + FK manquante
DO $$
BEGIN
  -- rename land_id -> garden_id si besoin
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='garden_reservations' AND column_name='land_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='garden_reservations' AND column_name='garden_id'
  ) THEN
    EXECUTE 'ALTER TABLE garden_reservations RENAME COLUMN land_id TO garden_id';
  END IF;
END$$;

-- owner_id manquant
ALTER TABLE garden_reservations
  ADD COLUMN IF NOT EXISTS owner_id INT;

-- FKs (gardener déjà créée dans ton script ; on ajoute owner si absent et garden si besoin)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_owner') THEN
    ALTER TABLE garden_reservations
      ADD CONSTRAINT fk_owner
      FOREIGN KEY (owner_id) REFERENCES t_users(id) ON DELETE CASCADE;
  END IF;

  -- si la contrainte vers t_gardens n'existe pas sous un autre nom (ex: fk_land), on la crée
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_garden')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_land') THEN
    ALTER TABLE garden_reservations
      ADD CONSTRAINT fk_garden
      FOREIGN KEY (garden_id) REFERENCES t_gardens(id) ON DELETE CASCADE;
  END IF;
END$$;
