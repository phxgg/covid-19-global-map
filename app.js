const covid = require('novelcovid');
const express = require('express');
const path = require('path');
const app = express();

const api = require('./api');

// Schedule API
(function schedule() {
    api.getall();

    api.getcountries().then(function() {
        console.log('getall finished. Waiting for next execution.');
        setTimeout(function() {
            console.log('Going to restart getall');
            schedule();
        }, 600000);
    });
})();

setInterval(() => {s
    api.getall();
    api.getcountries();
}, 600000);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
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

app.get('/test', async (req, res) => {
    res.status(400).send('wat');
    //res.render('test');
});

app.use(api.router);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Covid-19 webserver listening on ' + port);
});
