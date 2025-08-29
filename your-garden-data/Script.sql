-- =========================================================
-- RESET (dans l’ordre des dépendances)
-- =========================================================
BEGIN;

DROP TABLE IF EXISTS garden_reservations CASCADE;
DROP TABLE IF EXISTS t_gardens CASCADE;
DROP TABLE IF EXISTS t_lands CASCADE;
DROP TABLE IF EXISTS t_users CASCADE;

-- =========================================================
-- TABLES DE BASE
-- =========================================================

-- t_users (name -> last_name)
CREATE TABLE t_users (
    id         SERIAL PRIMARY KEY,
    last_name  VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   TEXT         NOT NULL,
    CONSTRAINT u_email UNIQUE (email)
);

-- t_lands (+ colonne manquante 'complet', FK user_id)
CREATE TABLE t_lands (
    id                   SERIAL PRIMARY KEY,
    cadastral_reference  VARCHAR(100) NOT NULL,
    land_name            VARCHAR(100) NOT NULL,
    land_adresse         TEXT         NOT NULL,
    nb_gardens           INT          NOT NULL CHECK (nb_gardens >= 0),
    land_img             TEXT,
    land_desc            TEXT,
    complet              BOOLEAN      NOT NULL DEFAULT FALSE,
    user_id              INT          NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
    CONSTRAINT t_lands_ukey UNIQUE (cadastral_reference)
);

-- t_gardens (ajouts/renames : garden_name, garden_desc, price, garden_img)
-- surface en INTEGER (entité Java = int)
CREATE TABLE t_gardens (
    id           SERIAL PRIMARY KEY,
    garden_name  TEXT         NOT NULL,
    garden_desc  TEXT         NOT NULL,
    surface      INTEGER      CHECK (surface > 0),
    price        DOUBLE PRECISION NOT NULL DEFAULT 0,
    garden_img   TEXT,
    land_id      INT          NOT NULL REFERENCES t_lands(id) ON DELETE CASCADE
);

-- =========================================================
-- TYPE + TABLE DE RÉSERVATION (alignées aux entités)
-- =========================================================

-- Type ENUM (on garde les valeurs en minuscules comme dans ton 1er script)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
    CREATE TYPE reservation_status AS ENUM ('pending','accepted','rejected');
  END IF;
END$$;

-- garden_reservations (land_id -> garden_id + ajout owner_id)
CREATE TABLE garden_reservations (
    id           SERIAL PRIMARY KEY,
    gardener_id  INT NOT NULL REFERENCES t_users(id)    ON DELETE CASCADE,
    owner_id     INT     REFERENCES t_users(id)         ON DELETE CASCADE,
    garden_id    INT NOT NULL REFERENCES t_gardens(id)  ON DELETE CASCADE,
    request_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status       reservation_status NOT NULL DEFAULT 'pending'
);

-- Index utiles
CREATE INDEX idx_t_lands_user_id           ON t_lands(user_id);
CREATE INDEX idx_t_gardens_land_id         ON t_gardens(land_id);
CREATE INDEX idx_reservations_gardener_id  ON garden_reservations(gardener_id);
CREATE INDEX idx_reservations_owner_id     ON garden_reservations(owner_id);
CREATE INDEX idx_reservations_garden_id    ON garden_reservations(garden_id);

COMMIT;
