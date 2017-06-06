/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const Acs = require('./mock-acs.js');


module.exports = CreateInstance;


function CreateInstance() {
    const acs = Acs();

    var inst = {
        start: function () {
            acs.start(9986);
        }
    }

    return inst;
}

