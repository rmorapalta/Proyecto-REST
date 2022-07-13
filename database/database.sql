CREATE TABLE IF NOT EXISTS student (
	id SERIAL PRIMARY KEY,
	email TEXT,
	nombre VARCHAR
);

CREATE TABLE IF NOT EXISTS section (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
	id SERIAL PRIMARY KEY,
	email VARCHAR NOT NULL,
	sala VARCHAR NOT NULL,
	seccion VARCHAR NOT NULL,
	entrada VARCHAR,
	salida VARCHAR
);

CREATE TABLE IF NOT EXISTS grade (
	id SERIAL PRIMARY KEY,
	id_seccion INT NOT NULL,
	id_estudiante INT NOT NULL,
	CONSTRAINT fk_seccion
		FOREIGN KEY(id_seccion)
			references seccion(id),
	CONSTRAINT fk_estudiante
		FOREIGN KEY(id_estudiante)
			references estudiante(id)
)

