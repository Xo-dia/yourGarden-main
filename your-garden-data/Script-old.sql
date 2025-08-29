DROP TABLE IF EXISTS t_users;
DROP TABLE IF EXISTS t_lands;
DROP TABLE IF EXISTS t_gardens;

-- Table des utilisateurs
CREATE TABLE t_users (
    id SERIAL NOT NULL,
    name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT null,
    constraint t_users_pkey primary key (id),
    constraint u_email unique (email)
);

-- Table des terrains
CREATE TABLE t_lands (
    id SERIAL NOT NULL,
    cadastral_reference VARCHAR(100) NOT NULL,
    land_name VARCHAR(100) NOT NULL,
    land_adresse TEXT NOT NULL,
    nb_gardens INT NOT NULL CHECK (nb_gardens >= 0),
    land_img TEXT,
    land_desc TEXT,
    constraint t_lands_pkey primary key (id),
    constraint t_lands_ukey unique (cadastral_reference),
    user_id INT NOT NULL REFERENCES t_users(id) ON DELETE cascade
);

-- Table des jardins
CREATE TABLE t_gardens (
    id SERIAL NOT NULL,
    designation VARCHAR(100) NOT NULL,
    surface NUMERIC CHECK (surface > 0),
    constraint t_gardens_pkey primary key (id),
    land_id INT NOT NULL REFERENCES t_lands(id) ON DELETE CASCADE
);

select * from t_users;
DELETE FROM t_users;
TRUNCATE TABLE t_users RESTART IDENTITY;
TRUNCATE TABLE t_users CASCADE;

SELECT * 
FROM recipes
JOIN catégories ON recipes.category_id = categories.id ;


