# API REST PROYECT
## ✨ Proyecto de asistencia por lectura de codigo QR - API REST
- Asignatura Computación Paralela y Distribuida (INFB8090)
- Semestre 2022-1
- Profesor Sebastian Salazar Molina.

<br>

## ✨ Descripcion
- Este proyecto de aplicación REST va a permitir llevar registro asistencia mediante la lectura de códigos QR. Se utilizaron las tecnologías de ExpressJS, NodeJS y PostgreSQL.

<br>

## ✨ Integrantes Grupo E
- Andres Segarra Pávez (andres.segarrap@utem.cl).
- Luis Rivas Sanchez (luis.rivass@utem.cl).
- Rodrigo Mora Palta (rmora@utem.cl).

<br>

## ✨ Requerimientos
- NodeJS, tener una version de Node
```bash
$ sudo apt-get install nodejs
```
- NPM, tener una version de NPM
```bash
$ sudo apt-get install npm
```
- Cliente de base de datos **PostgreSQL**
```bash
$ sudo apt install postgresql postgresql-contrib
```
- Docker, se requiere tener instalada una version de Docker, para esto se requieren seguir los pasos indicados en el siguiente link:
```bash
https://docs.docker.com/engine/install/ubuntu/
```

<br>

### ✨ Desarrollo
- Para antes de la ejecución, debemos prepar el sistema con los siguientes comandos
```bash
$ sudo npm install -g nodemon
$ sudo apt install node-pre-gyp
$ npm rebuild bcrypt --build-from-source
$ npm run dev
```
- Luego para levantar el proyecto con Docker:
```bash
$ docker compose build
$ docker compose up
```
