/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
;
const http = require('http');
const Mockup = require('../lib/mockup.js');

var conf = {
    ports: {
        acs: 9986
    }
};

describe ('Mockup', function () {
    var mockup = Mockup();
    before(function () {
        mockup.start();
    });

    after(function () {
        mockup.stop();
    });

    describe ('#ACS', function () {
        function get(path, callback) {
            return send('GET', conf.ports.acs, path, '', callback);
        };

        function post(port, path, data, callback) {
            return send('POST', conf.ports.acs, path, data, callback);
        };

        describe ('.getAgents', function () {
            it('should return a JSON array', function(done) {
                get('/v1/agents/', function (res) {
                    expect(res.statusCode).to.equal(200);
                    let agents = JSON.parse(res.data);
                    expect(agents).to.be.an('Array');
                    done();
                }).on('error', function (error) {
                    should.not.exist(error);
                    done(error);
                });

            });
        });
    });
});


function send(method, port, path, data, callback) {
    var body = '';
    if(typeof data === 'string') {
        body = data;
    } else {
        body = JSON.stringify(data);
    }

    var options = {
        host: "127.0.0.1",
        port: port,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on ('data', (chunk) => { 
            rawData += chunk; 
        }).on('end', function () { 
            res.data = rawData;
            callback(res);
        });
    });

    req.write(body);
    req.end();

    return req;
}
