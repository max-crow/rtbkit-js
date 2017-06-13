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

        budget: (topLevelAccountName, newValue, callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.post(`/v1/accounts/${topLevelAccountName}/budget`, newValue, callback);
            });
        },

        accounts: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/v1/accounts', callback);
            });
        },

        account: (name) => {
            return {
                name: () => {
                    return name;
                },

                summary: (callback) => {
                    return invoke(callback, function(callback) {
                        return rtbkit.get(`/v1/accounts/${name}/summary`, callback);
                    });
                },
                balance: (newValue, callback) => {
                    return invoke(callback, function(callback) {
                        return rtbkit.post(`/v1/accounts/${name}/balance`, newValue, callback);
                    });
                },
                children: (depth, callback) => {
                    if(typeof depth === 'function') {
                        callback = depth;
                        depth = 10;
                    } else {
                        depth = depth || 10;
                    }

                    return invoke(callback, function(callback) {
                        return rtbkit.get(`/v1/accounts/${name}/children?depth=${depth}`, callback);
                    });
                },
                close: (callback) => {
                    return invoke(callback, function(callback) {
                        return rtbkit.get(`/v1/accounts/${name}/close`, callback);
                    });
                },
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