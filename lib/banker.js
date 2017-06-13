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
        ping: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/ping', callback);
            });
        },

        summary: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/v1/summary', callback);
            });
        },

        accounts: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/v1/accounts', callback);
            });
        },

        account: (name) => {
            return {

            };
        },

        // getAgentConfig: (agentName, callback) => {
        //     return invoke(callback, function(callback) {
        //         return rtbkit.get(`/v1/agents/${agentName}/config`, callback);
        //     });
        // },

        // setAgentConfig: (agentName, config, callback) => {
        //     return invoke(callback, function(callback) {
        //         return rtbkit.post(`/v1/agents/${agentName}/config`, config, callback);
        //     });
        // }
    };

    return inst;
}