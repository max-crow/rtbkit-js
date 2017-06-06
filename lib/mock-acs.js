/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const express = require('express');

//const DEFAULT_PORT = 9986;

module.exports = CreateInstance;

function CreateInstance() {
    const app = express();

    const acs = {
        agents: {},

        getAgents: function () {
            return [];
        }
    };

    app.get('/v1/agents/', (req, res) => {
        let data = acs.getAgents();
        res.status(200).json(data);
    });


    var inst = {
        start: function (port) {
            app.listen(port, () => {
                console.log(`Mockup ACS listening on http://localhost:${port}`);
            });
        }
    };

    return inst;
}



