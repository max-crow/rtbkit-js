/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const invoke = require('./promise').asyncOrPromise;

module.exports = createInstance;

function createInstance(rtbkit) {
    var inst = {
        notify: (data, callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.post('', data, callback);
            });
        }
    };

    return inst;
}