/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const http = require('http');

module.exports = createInstance;

function createInstance(host, port, businessLogicFactory) {
            var options = {
                host: host,
                port: port,
                //path: path,
                //method: '',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': 0
                }
            };

            var send = function(method, path, data, callback) {
                //console.log(`\nsend(${method}, '${path}', '${data}', ${callback})\n`)
                var body = '';
                if(data /*!== undefined*/) {
                    if(typeof data === 'string') {
                        body = data;
                    } else {
                        body = JSON.stringify(data);
                    }
                }
                options.method = method;
                options.path = path;
                
                options.headers['Content-Length'] = Buffer.byteLength(body);

                //console.log(`\noptions: ${JSON.stringify(options)}\n`)

                var req = http.request(options, function(res) {
                    //const { statusCode } = res; 
                    //console.log(`response: ${res.statusCode}, ${JSON.stringify(res.headers)}`)

                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on ('data', (chunk) => { 
                        //console.log(`data`);
                        rawData += chunk; 
                    }).on('end', () => { 
                        //console.log(`end: '${rawData}'`)
                        if(rawData === '') {
                            res.data = null;        
                        } else {
                            //res.data = JSON.parse(rawData);
                            res.data = rawData;
                        }
                        callback(res);
                    });
                   
                });
                req.write(body);
                req.end();
                return req;
            };

            var server = {
                post: (path, data, callback) => {
                    return send('POST', path, data, callback);
                },
                get: (path, callback) => {
                    return send('GET', path, '', callback);
                }
            };

            return businessLogicFactory(server);
};  