var express = require('express');
var app = express();

app.use('/api/phieu', require('./routes/phieu'));
app.use('/api/muon', require('./routes/muon'));

module.exports = app;
