-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS t_accounts_roles;
DROP TABLE IF EXISTS t_roles;
DROP TABLE IF EXISTS t_accounts;
DROP TABLE IF EXISTS t_lands;

-- Table des comptes avec email et pseudo
CREATE TABLE t_accounts (
    id INT GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL,
    pseudo VARCHAR(255) NOT NULL,
    password VARCHAR(72) NOT NULL,
    CONSTRAINT t_account_pkey PRIMARY KEY (id),
    CONSTRAINT t_account_email_ukey UNIQUE (email),
    CONSTRAINT t_account_pseudo_ukey UNIQUE (pseudo)
);

-- Table des rôles
CREATE TABLE t_roles (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(72) NOT NULL,
    "default" BOOLEAN DEFAULT FALSE,
    CONSTRAINT t_role_pkey PRIMARY KEY (id),
    CONSTRAINT t_role_ukey UNIQUE (name)
);

-- Table de liaison comptes / rôles
CREATE TABLE t_accounts_roles (
    role_id INT NOT NULL,
    account_id INT NOT NULL,
    CONSTRAINT t_account_role_pkey PRIMARY KEY (role_id, account_id),
    CONSTRAINT t_role_fkey FOREIGN KEY (role_id) REFERENCES t_roles(id),
    CONSTRAINT t_account_fkey FOREIGN KEY (account_id) REFERENCES t_accounts(id) ON DELETE CASCADE
);

-- Table des terrains
CREATE TABLE t_lands (
    id INT GENERATED ALWAYS AS IDENTITY,
    cadastral_reference VARCHAR(16),
    land_name VARCHAR(100),
    land_adresse VARCHAR(255),
    number_of_garden INT,
    land_img VARCHAR(255),
    land_desc VARCHAR(255)
);


SELECT * FROM t_accounts;
SELECT * FROM t_roles;
SELECT * FROM t_accounts_roles;

create database garden_project;

select * from t_accounts ta;

INSERT INTO t_roles values (default, 'MANAGER', false);

INSERT INTO t_accounts_roles values (1, 1);
insert into t_accounts_roles values (2 ,  15);

insert into t_lands values (default, '93600123121234', 'zephir', '27 rue edgard degas', 52, null, 'jardin partager d edgard');
select * from t_lands tl; 

# un deux