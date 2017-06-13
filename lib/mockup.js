/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const acs = require('./mock-acs');
const banker = require('./mock-banker');


module.exports = CreateInstance;


function CreateInstance() {
    var inst = {
        start: function () {
            acs.start(9986);
            banker.start(9985);
        },

        stop: function() {
            acs.stop();
            banker.stop();
        }
    }

    return inst;
}

