import express from "express";
import { createServer } from "http";
import cors from 'cors';
import path from 'path';
const apiRouter = require('./routers/apiRouter');
const indexRouter = require('./routers/viewRouter');

const app = express();

// setup api routes
app.use(apiRouter);

// setup socket


// setup default html page
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', indexRouter);

// configure web server
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
app.set('port', PORT);
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});