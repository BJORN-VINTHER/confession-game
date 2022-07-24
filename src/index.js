const express = require("express");
const { createServer } = require("http");
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routers/apiRouter');
const app = express();

// setup api routes
app.use(apiRouter);

// setup default html page
var indexRouter = require('./routers/viewRouter');
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

console.log("just ran");