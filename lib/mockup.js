/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const acs = require('./mock-acs.js');


module.exports = CreateInstance;


function CreateInstance() {
    var inst = {
        start: function () {
            acs.start(9986);
        },

        stop: function() {
            acs.stop();
        }

    }

    return inst;
}

