const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const mainRouter = require('./routes/index')

// TODO: import swagger


// CONFIGURACIONES
const port = 3000
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

const corsOptions = { Credentials: true, origin: '*' };


// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());


// ROUTES
app.use('/grupo-E/', mainRouter)


// START SERVER
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

