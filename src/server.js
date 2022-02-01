require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { Server: HttpServer } = require('http');

const authRouter = require('./routers/auth');
const productsRouter = require('./routers/products');
const cartRouter = require('./routers/cart');
const multerRouter = require('./routers/multer');

const { authMiddleware } = require('./middlewares/auth');

const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const cluster = require('cluster');
const logger = require('./utils/winston');

const compression = require('compression');
const numCPUS = require('os').cpus().length;

const server = express();
const httpServer = new HttpServer(server);

server.use(compression());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.set('view engine', 'ejs');

server.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}));

server.use(passport.initialize());
server.use(passport.session())

server.use(authRouter);
server.use(multerRouter);
server.use('/api/productos', productsRouter);
server.use('/api/carrito', cartRouter);

let port = process.env.PORT || 8080;

server.get('/', authMiddleware, (req, res) => {
    res.render('../views/pages/index.ejs', {
        email: req.user.email
    });
});

mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        if (err) {
            console.error('Error Mongo');
        }
    });

const isCluster = process.argv[2] === 'CLUSTER';

if (cluster.isMaster && isCluster) {

    for (let i = 0; i < numCPUS; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${worker.process.pid} died ${new Date().toLocaleString()}`);
        cluster.fork();
    })
} else {

    const app = httpServer.listen(port, () => {
        logger.info(`Servidor corriendo en ${port}`);
    });

    app.on('error', (error) => {
        logger.error(`Error: ${error}`);
    });

}
