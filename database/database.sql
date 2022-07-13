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
	section VARCHAR NOT NULL,
	entrada VARCHAR,
	salida VARCHAR
);

CREATE TABLE IF NOT EXISTS grade (
	id SERIAL PRIMARY KEY,
	id_section INT NOT NULL,
	id_student INT NOT NULL,
	CONSTRAINT fk_section
		FOREIGN KEY(id_section)
			references section(id),
	CONSTRAINT fk_student
		FOREIGN KEY(id_student)
			references student(id)
)

