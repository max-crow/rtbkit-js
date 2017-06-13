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
        acs: 9986,
        banker: 9985
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
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
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
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
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
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });

            });
        });

    });
    //----------------------------------------------------------------
    describe ('#Banker', function () {
        function get(path, callback) {
            return send('GET', conf.ports.banker, path, '', callback);
        };

        function post(path, data, callback) {
            return send('POST', conf.ports.banker, path, data, callback);
        };

        describe ('.ping()', function () {
            it('should return "pong"', function(done) {
                get('/ping', function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.ping'});
                    expect(res).to.have.a.property('data', '"pong"');
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        describe ('.summary()', function () {
            it('should return a JSON object', function(done) {
                get('/v1/summary', function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.summary'});
                    expect(res).to.have.a.property('data');
                    let data = JSON.parse(res.data);
                    expect(data).to.be.an('object');
                    //assert(typeof data === 'object', 'config should be an object or null');
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        describe ('.accounts()', function () {
            it('should return an Array', function(done) {
                get('/v1/accounts', function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.accounts'});
                    expect(res).to.have.a.property('data');
                    let data = JSON.parse(res.data);
                    expect(data).to.be.an('array');
                        done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        describe ('.getAccountSummary()', function () {
            it('should return an Object for a valid name', function(done) {
                var name = 'hello:world';
                get(`/v1/accounts/${name}/summary`, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.getAccountSummary'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res).to.have.a.property('data');
                    let data = JSON.parse(res.data);
                    expect(data).to.be.an('object');
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
            it('should return HTTP 400 for an invalid name', function(done) {
                var name = 'invalid:account';
                get(`/v1/accounts/${name}/summary`, function(res) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.headers).to.include.key({'method-name': 'banker.getAccountSummary'});
                    expect(res.headers).to.include.key({'account-name': name});
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        
        describe ('.setBudget()', function () {
            var budget = { "USD/1M": 1000000 };
            it('should return HTTP 200 for the top-level account', function(done) {
                var name = 'hello';
                post(`/v1/accounts/${name}/budget`, budget, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.setBudget'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res.headers).to.include.key({'budget': JSON.stringify(budget)});
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
            it('should return HTTP 400 for non-top level accounts', function(done) {
                var name = 'hello:world';
                post(`/v1/accounts/${name}/budget`, budget, function(res) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.headers).to.include.key({'method-name': 'banker.setBudget'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res.headers).to.include.key({'budget': JSON.stringify(budget)});
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        
        describe ('.setBalance()', function () {
            var balance = { "USD/1M": 1000000 };
            it('should return HTTP 200 for the non-top-level account', function(done) {
                var name = 'hello:world';
                post(`/v1/accounts/${name}/balance`, balance, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.setBalance'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res.headers).to.include.key({'balance': JSON.stringify(balance)});
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
            it('should return HTTP 400 for top-level accounts', function(done) {
                var name = 'hello';
                post(`/v1/accounts/${name}/balance`, balance, function(res) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.headers).to.include.key({'method-name': 'banker.setBalance'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res.headers).to.include.key({'balance': JSON.stringify(balance)});
                    done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
        
        describe ('.getAccountChildren()', function () {
            var name = 'hello:world';
            var depth = 10;
            it('should return an Object', function(done) {
                get(`/v1/accounts/${name}/children?depth=${depth}`, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers).to.include.key({'method-name': 'banker.getAccountChildren'});
                    expect(res.headers).to.include.key({'account-name': name});
                    expect(res.headers).to.include.key({'depth': depth.toString()});
                    expect(res).to.have.a.property('data');
                    let data = JSON.parse(res.data);
                    expect(data).to.be.an('object');
                        done();
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);  
                })
            });
        });
    });
    //----------------------------------------------------------------
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
