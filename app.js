var covid = require('novelcovid');
var express = require('express');
var path = require('path');
var app = express();

// covid.all()
// covid.countries()

app.set('view engine', 'ejs')

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    var all;
    covid.all()
        .then((data) => {
            all = data;
        })
        .catch((err) => {
            console.log('[API: all]: ' + err);
            res.status(400).render('bad');
        });

    covid.countries()
        .then((countries) => {
            res.render('index', {
                all: all,
                countries: countries
            });
        })
        .catch((err) => {
            console.log('[API: countries]: ' + err);
            res.status(400).render('bad');
        });
});

app.get('/test', (req, res) => {
    res.status(400).send('wat');
    //res.render('test');
});

app.listen(80, () => {
    console.log('Covid-19 webserver listening on 80');
});
