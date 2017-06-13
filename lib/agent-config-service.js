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
        agent: (name) => {
            if(Array.isArray(name)) {
                name = name.join(':');
            }
            return {
                name: () => {
                    return name;
                },

                config: (newValue, callback) => {
                    if(!callback) {
                        callback = newValue;
                        newValue = undefined;
                    }
                    return invoke(callback, function(callback) {
                        if(newValue) {
                            return rtbkit.post(`/v1/agents/${name}/config`, newValue, callback);
                        }
                        return rtbkit.get(`/v1/agents/${name}/config`, callback);
                    });
                }
            }
        },

        agents: (callback) => {
            return invoke(callback, function(callback) {
                return rtbkit.get('/v1/agents/', callback);
            });
        },

    };

    return inst;
}