/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const app = require('express')();
const rtbkit = require('rtbkit-js');

const PORT = 888;

const RTBKIT_HOST = '127.0.0.1';

const adserver = rtbkit.instance(RTBKIT_HOST).adserver;

app.get('/win', function (req, response) {
    var data = {
        timestamp: Date.now() / 1000,
        bidRequestId: req.query.brid,
        impid: req.query.impid,
        price: parseFloat(req.query.price)
    };

    adserver.win(data, function(res) {
        console.log(`win notice (${res.statusCode}): '${JSON.stringify(data)}'`);
        response.status(res.statusCode).end();
    }).on('error', function(err) {
        console.log(`win notice error '${err.message}': '${JSON.stringify(data)}'`);
        response.status(500).end();
    });
});


app.listen(PORT, function(){
    console.log(`nurl proxy server listing on: http://localhost:${PORT}`);
});




