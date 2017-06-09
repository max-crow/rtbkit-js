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
        }
    };

    app.get('/v1/agents/', (req, res) => {
        let data = acs.getAgents();
        res.status(200).json(data);
    });
})

