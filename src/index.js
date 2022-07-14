const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
<<<<<<< Updated upstream
=======
const path = require('path');
>>>>>>> Stashed changes
const mainRouter = require('./routes/index');
const fs = require('fs');
const sql = fs.readFileSync('./database/database.sql').toString();
const { initDatabase } = require('./controllers/index.controllers');
// Inicializar BDD
initDatabase();


// SWAGGER
const swaggerDocs = swaggerJsdoc({
	swaggerDefinition: {
		openapi: "3.0.1",
		info: {
			version: "1.0.0",
			title: "API REST CLASSROOM",
			description: "Proyecto para el curso de Computación Paralela y Distribuida, UTEM.",
			contact: {
				name: "Grupo E",
				email: "rmora@utem.cl"
<<<<<<< Updated upstream
			},
			servers: ["http://localhost:3000"]
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
			}
		}
	},
	apis: ["./routes/*.js"]
=======
			}
		},
		servers: [
			{
				url: "http://localhost:3000"
			}
		]
	},
	apis: [`${path.join(__dirname, "./routes/*.js")}`]
>>>>>>> Stashed changes
});


// CONFIGURACIONES
const port = process.env.PORT || 3000;
app.set('port', port);


// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use((_, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE', 'OPTIONS', 'HEAD');
	next();
});
app.use(cookieParser());


// ROUTES
app.use('/grupo-E/', mainRouter);
app.use("/grupo-E/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


// START SERVER
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

