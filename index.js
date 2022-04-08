const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

const mysql = require('mysql');
var myConnection = require('express-myconnection');

var config = require('./config/dbconfig');
var dbOptions = {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        port: config.database.port,
        database: config.database.db
    }
    /**
     * 3 strategies can be used
     * single: Creates single database connection which is never closed.
     * pool: Creates pool of connections. Connection is auto release when response ends.
     * request: Creates new connection per new request. Connection is auto close when response ends.
     */
app.use(myConnection(mysql, dbOptions, 'single'))


app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

const routex = require('./route/route');
app.use('/', routex);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});