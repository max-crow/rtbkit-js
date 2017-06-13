/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const express = require('express');

module.exports = createInstance;

function createInstance(api) {
    const app = express();
    api(app);

    var server;
    var curr_port;
    var inst = {
        start: function (port) {
            server = app.listen(port, () => {
                curr_port = port;
                //console.log(`Mockup API listening on http://localhost:${port}`);
            });
        },

        stop: function() {
            server && server.close();
            //console.log(`Mockup API stopped (${curr_port})`);
        }
    };
    return inst;
}



