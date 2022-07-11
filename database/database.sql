CREATE DATABASE estudiantes;

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	email TEXT,
	name VARCHAR(20),
	classroom VARCHAR(6),
	subject VARCHAR(8),
	entrance VARCHAR(24),
	leaving VARCHAR(24)
);

INSERT INTO users (email, name, classroom) VALUES
    ('lucho@utem.cl', 'aka420', 'M2-420'),
    ('andres@utem.cl', 'andre', 'M2-wfu');
