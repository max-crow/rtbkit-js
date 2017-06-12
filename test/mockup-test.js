/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert
;
const http = require('http');
const mockup = require('../lib/mockup.js')();

var conf = {
    ports: {
        acs: 9986
    }
};

describe ('Mockup', function () {
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

        function post(path, data, callback) {
            return send('POST', conf.ports.acs, path, data, callback);
        };

        describe ('.getAgents', function () {
            it('should return a JSON array', function(done) {
                get('/v1/agents/', function (res) {
                    expect(res.headers).to.include.key({'method-name': 'getAgents'});
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

        describe ('.getAgentConfig', function () {
            it('should return an object', function(done) {
                var agent = 'test-agent';
                get(`/v1/agents/${agent}/config`, function (res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'getAgentConfig'});
                    expect(res.headers).to.include.key({'agent': agent});
                    let config = JSON.parse(res.data);
                    assert(typeof config === 'object', 'config should be an object or null');
                    done();
                }).on('error', function (error) {
                    should.not.exist(error);
                    done(error);
                });

            });
        });

        describe ('.setAgentConfig', function () {
            it('should return HTTP 200', function(done) {
                var agent = 'test-agent';
                var config = JSON.stringify({ account: ['hello', 'world'] });
                post(`/v1/agents/${agent}/config`, config, function (res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'setAgentConfig'});
                    expect(res.headers).to.include.key({'agent': agent});
                    expect(res.headers).to.include.key({'config': config});
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
