var passport    = require('./app/auth'),
    responseTime = require('response-time')

app.use(passport.initialize());
app.use(responseTime());