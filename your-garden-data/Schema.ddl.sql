DROP TABLE IF EXISTS t_accounts;
DROP TABLE IF EXISTS t_roles;
DROP TABLE IF EXISTS t_accounts_roles;




CREATE TABLE t_accounts (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255),
    password VARCHAR (72),
    CONSTRAINT t_account_pkey PRIMARY KEY (id),
    CONSTRAINT t_account_ukey unique (username)
);


CREATE TABLE t_roles(
	id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (72) NOT NULL,
    "default" boolean DEFAULT false,
    CONSTRAINT t_role_pkey PRIMARY KEY (id),
    CONSTRAINT t_role_ukey unique (name)
);


CREATE TABLE t_accounts_roles (
	role_id INT NOT NULL,
	account_id INT NOT NULL,
	CONSTRAINT t_account_role_pkey PRIMARY KEY (role_id,account_id),
	CONSTRAINT t_role_fkey FOREIGN KEY (role_id) REFERENCES t_roles(id),
	CONSTRAINT t_account_fkey FOREIGN KEY (account_id) REFERENCES t_accounts(id) ON DELETE CASCADE
);


SELECT * FROM t_accounts;
SELECT * FROM t_roles;
SELECT * FROM t_accounts_roles;

create database garden_project;

select * from t_accounts ta;

INSERT INTO t_roles values (default, 'MANAGER', false);

INSERT INTO t_accounts_roles values (2, 14);
insert into t_accounts_roles values (2 ,  15)
