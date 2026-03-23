'use strict';

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const educationRouter = require('./routes/education');
const qaRouter = require('./routes/qa');
const professionalsRouter = require('./routes/professionals');
const resourcesRouter = require('./routes/resources');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', (filePath, options, callback) => {
  const fs = require('fs');
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) return callback(err);
    const rendered = content.replace(/\{\{(\w+)\}\}/g, (_, key) =>
      options[key] !== undefined ? options[key] : ''
    );
    return callback(null, rendered);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/education', educationRouter);
app.use('/qa', qaRouter);
app.use('/professionals', professionalsRouter);
app.use('/resources', resourcesRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

module.exports = app;
