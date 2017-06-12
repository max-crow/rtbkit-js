/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const apiApp = require('./mock-api-app');

//const DEFAULT_PORT = 9986;

module.exports = apiApp(function(app){
    const acs = {
        //agents: {},

        getAgents: function () {
            return [];
        },

        getAgentConfig: function (name) {
            return {};
        },
        setAgentConfig: function (name, config) {
            return;
        }
    };

    app.get('/v1/agents/', (req, res) => {
        res.set('method-name', 'getAgents');
        let data = acs.getAgents();
        res.status(200).json(data);
    });

    app.get('/v1/agents/:agent/config', (req, res) => {
        res.set('method-name', 'getAgentConfig');
        res.set('agent', req.params.agent);
        var config = acs.getAgentConfig();

        res.status(200).json(config);
    });

    app.post('/v1/agents/:agent/config', (req, res) => {
        res.set('method-name', 'setAgentConfig');
        res.set('agent', req.params.agent);
        res.set('config', req.data);
        acs.setAgentConfig(req.params.agent, req.data);
        res.status(200).end();
    });

});

