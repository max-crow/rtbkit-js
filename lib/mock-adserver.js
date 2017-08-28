/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const apiApp = require('./mock-api-app');

module.exports = {
    winServ: apiApp(function(app){

        app.post('', (req, res) => {
            res.set('method-name', 'win');
            res.set('data', req.data);
            res.status(200).end();
        });

    })
};

