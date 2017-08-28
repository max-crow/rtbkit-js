/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const apiFactory = require('./api-factory.js');
const acs = require('./agent-config-service.js');
const banker = require('./banker.js');
const adserver = require('./adserver.js');


module.exports = createInstance;

var default_instance_options = {
    ports: {
        acs: 9986,
        banker: 9985,

        win: 12340,
        event: 18144
    },
    routers: {
        // mock: {
        //     port: 12339,
        //     path: '/auctions'
        // }
    }
}


function createInstance(host, options) {
    options = options || default_instance_options; 
    var winServer = apiFactory(host, options.ports.win, adserver.winApi);
    var inst = {
       acs: apiFactory(host, options.ports.acs, acs), 
       banker: apiFactory(host, options.ports.banker, banker),
       adserver: {
           win: function(data, callback) {
               return winServer.notify(data, callback);
           }
       } 
    }
    return inst;
}
