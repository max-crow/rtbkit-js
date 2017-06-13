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
//const chaiAsPromised = require("chai-as-promised"); 
//chai.use(chaiAsPromised);

const rtbkit = require('../index.js')
    , mockup = rtbkit.instance('127.0.0.1')
    , spawn = rtbkit.spawn
    , mockupServer = rtbkit.mockup
;

describe ('RTBkit', function () {
    before(function() {
        mockupServer.start();
    });

    after(function() {
        mockupServer.stop();
    });
    describe('#Agent Config Service', function() {
        describe ('.getAgents()', function() {
            it('should return a JSON array (callback)', function(done) {
                mockup.acs.getAgents(function(res) {
                    expect(res).to.have.a.property('statusCode', 200)
                    expect(res.headers).to.include.key({'method-name': 'getAgents'});
                    let agents = JSON.parse(res.data);
                    expect(agents).to.be.an('Array');
                    done();                
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('should return a JSON array (Promise)', function(done) {
                spawn(function* () {
                    try {
                        let res = yield mockup.acs.getAgents();
                        expect(res).to.have.a.property('statusCode', 200);
                        expect(res).to.have.a.property('data');
                        let agents = JSON.parse(res.data);
                        expect(agents).to.be.an('Array');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });

        describe ('.getAgentConfig()', function() {
            var agent = "test-agent";
            it("Should invoke the proper Mockup's method (callback)", function(done) {
                mockup.acs.getAgentConfig(agent, function(res) {
                    expect(res).to.have.a.property('statusCode', 200);
                    expect(res.headers).to.include.key({'method-name': 'getAgentConfig'});
                    expect(res.headers).to.include.key({'agent': agent});
                    done();                
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it("Should invoke the proper Mockup's method (Promise)", function(done) {
                spawn(function* () {
                    try {
                        let res = yield mockup.acs.getAgentConfig(agent);
                        expect(res).to.have.a.property('statusCode', 200);
                        expect(res.headers).to.include.key({'method-name': 'getAgentConfig'});
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });

        describe ('.setAgentConfig()', function() {
            var agent = 'test-agent';
            var config = {};
            it("Should invoke the proper Mockup's method (callback)", function(done) {
                mockup.acs.setAgentConfig(agent, config, function(res) {
                    expect(res.headers).to.include.key({'method-name': 'setAgentConfig'});
                    expect(res).to.have.a.property('statusCode', 200)
                    done();                
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it("Should invoke the proper Mockup's method (Promise)", function(done) {
                spawn(function* () {
                    try {
                        let res = yield mockup.acs.setAgentConfig(agent, config);
                        expect(res.headers).to.include.key({'method-name': 'setAgentConfig'});
                        expect(res).to.have.a.property('statusCode', 200)
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });

    });
    //---------------------------------------------------------
    describe('#Banker', function() {
        describe ('.ping()', function() {
            it('should return "pong" (callback)', function(done) {
                mockup.banker.ping(function(res) {
                    expect(res).to.have.a.property('statusCode', 200)
                    expect(res.headers).to.include.key({'method-name': 'banker.ping'});
                    expect(res).to.have.a.property('data', '"pong"');
                    done();                
                }).on('error', function(err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('should return "pong" (async/await)', function(done) {
                !async function() {
                    try {
                        let res = await mockup.banker.ping();
                        expect(res).to.have.a.property('statusCode', 200);
                        expect(res).to.have.a.property('data', '"pong"');
                        done();
                    } catch (err) {
                        done(err);
                    }
                }();
            });
        });
    });
    //---------------------------------------------------------
});


