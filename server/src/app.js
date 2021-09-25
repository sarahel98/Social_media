const path = require('path');
const api = require('./api.js');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(session);
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // This middleware allows you to retrieve the data sent as “Content-Type: application/x-www-form-urlencoded”,
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'sarahelghazzi',
    store: new MemoryStore(),
    expires: new Date(Date.now() + 30 * 86400 * 1000),
    saveUninitialized: true,
    resave: false,
    maxAge: null,
    cookie: {},
  })
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use('/', routes);

app.use(function (req, res, next) {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
  return;
});

// Démarre le serveur
app.on('close', () => {});
exports.default = app;
