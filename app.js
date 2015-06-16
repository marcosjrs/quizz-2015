var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials()); //midleware que se encargará del layout principal

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());// Se ha quitado { extended: false } para poder pasar parametros pseudo JSON por POST...
app.use(cookieParser('Quiz 2015'));// añadir semilla "Quiz 2015" para cifrar cookie (pequeña encriptación que realiza)
app.use(session()); //Instalar MW session
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos

app.use(function(req,res, next){//midleware para la sesión
    //guardar el path en session.redir siempre que no sean login o logout
    // para cuando se haga el login o logout, recoger ese path para hacer la redirección.
    // para saber donde estaba el cliente antes de hacer login o logout.
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    //la sesión que está accesible en req.session la copia en res.locals.session para que luego
    //esté accesible desde todas las vistas.
    res.locals.session = req.session; //la ponemos en locals para no tener que ponerla como parametro

    //continua lo la petición original
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
