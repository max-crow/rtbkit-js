/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const apiApp = require('./mock-api-app');

 module.exports = apiApp(function(app){

    app.get('/ping', (req, res) => {
        res.set('method-name', 'banker.ping');
        let data = 'pong';
        res.status(200).json(data);
    });

    app.get('/v1/summary', (req, res) => {
        res.set('method-name', 'banker.summary');
        var summary = {};

        res.status(200).json(summary);
    });

    app.get('/v1/accounts', (req, res) => {
        res.set('method-name', 'banker.accounts');
        var accounts = [];

        res.status(200).json(accounts);
    });

//     app.post('/v1/agents/:agent/config', (req, res) => {
//         res.set('method-name', 'setAgentConfig');
//         res.set('agent', req.params.agent);
//         res.set('config', req.data);
//         acs.setAgentConfig(req.params.agent, req.data);
//         res.status(200).end();
//     });

 });

