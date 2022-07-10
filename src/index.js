const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const mainRouter = require('./routes/index.js')
const tokenRouter = require('./routes/token-router.js')
const classroomRouter = require('./routes/classroom-router.js')
const authRouter = require('./routes/auth-router.js')

// TODO: import postgress
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
app.use('/', mainRouter)
app.use('/v1/tokens', tokenRouter)
app.use('/v1/classroom', classroomRouter)
app.use('/v1/authentication', authRouter)


// START SERVER
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

