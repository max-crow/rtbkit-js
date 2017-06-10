/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const invoke = require('./promise').asyncOrPromise;

module.exports = createInstance;

function createInstance(rtbkit) {
    //console.log('create ACS.')
    //console.log(conf);
    var inst = {
        getAgents: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/v1/agents/', callback);
            });
        }//,
        // setAgentConfig: (agentName, config, callback) => {
        //     return rtbkit.post(`/v1/agents/${agentName}/config`, config, callback);
        // },
        // getAgentConfig: (agentName, callback) => {
        //     return rtbkit.get(`/v1/agents/${agentName}/config`, '', callback);
        // }
    };

    return inst;
}