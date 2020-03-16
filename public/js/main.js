function getPercentage(total, obtained) {
    var percentage = (obtained * 100)/total;
    return percentage.toFixed(2) + '%';
}

function num(num) {
    return Number(num).toLocaleString('el-GR');
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip();

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
                /*fill: '#F8E23B',
                stroke: '#383f47'*/
            }
        },
        backgroundColor: '#383f47',
        markers: [
            {latLng: [33.02, 143.71], name: 'Diamond Princess'},
        ],
        onMarkerTipShow: function(event, label, code) {
            label.html(
                '<h6 class="text-primary">' +  label.html() + '</h6>'
                    + 'Cases: <span class="badge badge-primary"> ' + num(data['DiamondPrincess']['cases']) + '</span>'
                    + '<br>Deaths: <span class="badge badge-danger">' + num(data['DiamondPrincess']['deaths']) + '</span>'
                    + '<br>Today Cases: <span class="badge badge-info">' + num(data['DiamondPrincess']['todayCases']) + '</span>'
                    + '<br>Today Deaths: <span class="badge badge-danger">' + num(data['DiamondPrincess']['todayDeaths']) + '</span>'
                    + '<br>Recovered: <span class="badge badge-success">' + num(data['DiamondPrincess']['recovered']) + '</span>'
                    + '<br>Critical: <span class="badge badge-warning">' + num(data['DiamondPrincess']['critical']) + '</span>'
            );                
        },
        onRegionTipShow: function(e, el, code) {
            // for(var i = 0; i < countries.length; i++) {
            //     var obj = countries[i];
            //     if(obj['country'] == el.html()
            //     || obj['country'] == 'USA' && el.html() == 'United States'
            //     || obj['country'] == 'S. Korea' && el.html() == 'Korea'
            //     || obj['country'] == 'French Guiana' && el.html() == 'France') {
            //         el.html(
            //             '<h6 class="text-primary">' +  el.html() + '</h6>'
            //             + 'Cases: <span class="badge badge-primary"> ' + num(obj['cases']) + '</span>'
            //             + '<br>Deaths: <span class="badge badge-danger">' + num(obj['deaths']) + '</span>'
            //             + '<br>Today Cases: <span class="badge badge-info">' + num(obj['todayCases']) + '</span>'
            //             + '<br>Today Deaths: <span class="badge badge-danger">' + num(obj['todayDeaths']) + '</span>'
            //             + '<br>Recovered: <span class="badge badge-success">' + num(obj['recovered']) + '</span>'
            //             + '<br>Critical: <span class="badge badge-warning">' + num(obj['critical']) + '</span>'
            //         );
            //     }
            // }
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