function getPercentage(total, obtained) {
    total = parseInt(total.replace(/\./g,'').replace('.',','));
    obtained = parseInt(obtained.replace(/\./g,'').replace('.',','));

    var percentage = (obtained * 100)/total;
    return percentage.toFixed(2) + '%';
}

function num(num) {
    return Number(num).toLocaleString('el-GR');
}

// Main stuff
$(function() {
    $('[data-toggle="tooltip"]').tooltip();

    // start doing map things
    var all = JSON.parse($('#all').val());
    var countries = JSON.parse($('#countries').val());

    var global = {
        cases: num(all['cases']),
        deaths: num(all['deaths']),
        recovered: num(all['recovered'])
    }

    $('#globalCases').html(global.cases);
    $('#globalDeaths').html(global.deaths + ' (' + getPercentage(global.cases, global.deaths) + ')');
    $('#globalRecovered').html(global.recovered + ' (' + getPercentage(global.cases, global.recovered) + ')');

    var data = {};
    var scaling = {}; // used for the map colors

    // convert to country code data cuz the map only support country code
    for(var i = 0; i < countries.length; i++){
        var obj = countries[i];

        scaling[getCountryCode(obj['country'])] = obj['cases'];

        data[getCountryCode(obj['country'])] = {
            'cases': obj['cases'],
            'deaths': obj['deaths'],
            'todayCases': obj['todayCases'],
            'todayDeaths': obj['todayDeaths'],
            'recovered': obj['recovered'],
            'critical': obj['critical'],
        };
    }

    // see logs for any wrong country
    console.log(data);

    $('#map').vectorMap({
        map: 'world_mill',
        series: {
            regions: [{
                values: scaling,
                scale: ['#ffe6e6', '#b30000'],
                normalizeFunction: 'polynomial',
            }]
        },
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                image: '/static/images/cruiseship1.png',
            }
        },
        backgroundColor: '#383f47',
        markers: [
            {latLng: [55.33, 3.83], name: 'MS Zaandam'},
            {latLng: [33.02, 143.71], name: 'Diamond Princess'},
        ],
        onMarkerTipShow: function(event, label, code) {
            var markerData = {};

            if(label.html() == 'Diamond Princess'){
                markerData = data['DiamondPrincess'];
            }
            else if(label.html() == 'MS Zaandam') {
                markerData = data['MSZaandam'];
            }
            
            label.html(
                '<h6 class="text-primary">' +  label.html() + '</h6>'
                    + 'Cases: <span class="badge badge-primary"> ' + num(markerData['cases']) + '</span>'
                    + '<br>Deaths: <span class="badge badge-danger">' + num(markerData['deaths']) + '</span>'
                    + '<br>Today Cases: <span class="badge badge-info">' + num(markerData['todayCases']) + '</span>'
                    + '<br>Today Deaths: <span class="badge badge-danger">' + num(markerData['todayDeaths']) + '</span>'
                    + '<br>Recovered: <span class="badge badge-success">' + num(markerData['recovered']) + '</span>'
                    + '<br>Critical: <span class="badge badge-warning">' + num(markerData['critical']) + '</span>'
            );
        },
        onRegionTipShow: function(e, el, code) {
            if(data[code]) {
                el.html(
                    '<h6 class="text-primary">' +  el.html() + '</h6>'
                    + 'Cases: <span class="badge badge-primary"> ' + num(data[code]['cases']) + '</span>'
                    + '<br>Deaths: <span class="badge badge-danger">' + num(data[code]['deaths']) + '</span>'
                    + '<br>Today Cases: <span class="badge badge-info">' + num(data[code]['todayCases']) + '</span>'
                    + '<br>Today Deaths: <span class="badge badge-danger">' + num(data[code]['todayDeaths']) + '</span>'
                    + '<br>Recovered: <span class="badge badge-success">' + num(data[code]['recovered']) + '</span>'
                    + '<br>Critical: <span class="badge badge-warning">' + num(data[code]['critical']) + '</span>'
                );
            } else {
                el.html(el.html());
            }
        }
    });
});