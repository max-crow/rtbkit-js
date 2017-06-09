/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const instance = require('./instance.js');

module.exports = {
    instance: function(host, options) {
        return instance(host, options);
    }
};