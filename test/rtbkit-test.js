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
//const chaiAsPromised = require("chai-as-promised"); 
//chai.use(chaiAsPromised);

const rtbkit = require('../index.js')
    , mockup = rtbkit.instance('127.0.0.1')
    , spawn = rtbkit.spawn
    , mockupServer = rtbkit.mockup
;

describe ('RTBkit', function () {
    describe('# APIs', function() {
        before(function() {
            mockupServer.start();
        });

        after(function() {
            mockupServer.stop();
        });
        describe('## Agent Config Service', function() {
            describe ('.agents()', function() {
                it('should return a JSON array (callback)', function(done) {
                    mockup.acs.agents(function(res) {
                        expect(res).to.have.a.property('statusCode', 200)
                        expect(res.headers).to.include.key({'method-name': 'getAgents'});
                        let agents = (res.data);
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
                            let res = yield mockup.acs.agents();
                            //expect(res).to.have.a.property('statusCode', 200);
                            //expect(res).to.have.a.property('data');
                            //let agents = (res.data);
                            expect(res).to.be.an('Array');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });

            describe('## ACS.Agent', function() {
                var agentPath = ["hello", "world"];
                var agentName = agentPath.join(':');
                describe('.agent()', function() {
                    it("Should return an object with the proper name (name as a string)", function() {
                        var agent = mockup.acs.agent(agentName);
                        expect(agent).to.be.an('object');
                        expect(agent.name()).to.be.equal(agentName);
                    });
                });

                describe ('Agent.config()', function() {
                    var agent = "test-agent";
                    it("Should invoke the proper Mockup's method (callback)", function(done) {
                        mockup.acs.agent(agent).config(function(res) {
                            expect(res).to.have.a.property('statusCode', 200);
                            expect(res.headers).to.include.key({'method-name': 'getAgentConfig'});
                            expect(res.headers).to.include.key({'agent': agent});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it("Promise: Should not raise any exceptions", function(done) {
                        spawn(function* () {
                            try {
                                let res = yield mockup.acs.agent(agent).config();
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                    });
                });

                describe ('Agent.config(newValue)', function() {
                    var agent = 'test-agent';
                    var config = {};
                    it("Should invoke the proper Mockup's method (callback)", function(done) {
                        mockup.acs.agent(agent).config(config, function(res) {
                            expect(res).to.have.a.property('statusCode', 200)
                            expect(res.headers).to.include.key({'method-name': 'setAgentConfig'});
                            expect(res.headers).to.include.key({'agent': agent});
                            expect(res.headers).to.include.key({'config': JSON.stringify(config)});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it("Promise: Should not raise any exceptions", function(done) {
                        spawn(function* () {
                            try {
                                let res = yield mockup.acs.agent(agent).config(config);
                                done();
                            } catch (err) {
                                done(err);
                            }
                        });
                    });
                });
            });

        });
        //---------------------------------------------------------
        describe('## Banker', function() {
            describe ('.ping()', function() {
                it('should return "pong" (callback)', function(done) {
                    mockup.banker.ping(function(res) {
                        expect(res).to.have.a.property('statusCode', 200)
                        expect(res.headers).to.include.key({'method-name': 'banker.ping'});
                        expect(res).to.have.a.property('data', 'pong');
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
                            expect(res).to.be.equal('pong');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }();
                });
            });

            describe ('.summary()', function() {
                it('should return an object (callback)', function(done) {
                    mockup.banker.summary(function(res) {
                        expect(res).to.have.a.property('statusCode', 200)
                        expect(res.headers).to.include.key({'method-name': 'banker.summary'});
                        expect(res).to.have.a.property('data');
                        let data = (res.data);
                        expect(data).to.be.an('object');
                        done();                
                    }).on('error', function(err) {
                        should.not.exist(err);
                        done(err);
                    });
                });
                it('Async/await: Should retrun an object', function(done) {
                    !async function() {
                        try {
                            let res = await mockup.banker.summary();
                            expect(res).to.be.an('object');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }();
                });
            });

            describe ('.accounts()', function() {
                it('should return an array (callback)', function(done) {
                    mockup.banker.accounts(function(res) {
                        expect(res).to.have.a.property('statusCode', 200)
                        expect(res.headers).to.include.key({'method-name': 'banker.accounts'});
                        expect(res).to.have.a.property('data');
                        let data = (res.data);
                        expect(data).to.be.an('array');
                        done();                
                    }).on('error', function(err) {
                        should.not.exist(err);
                        done(err);
                    });
                });
                it('Async/await: should not raise any exceptions', function(done) {
                    !async function() {
                        try {
                            let res = await mockup.banker.accounts();
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }();
                });
            });

            describe ('.budget(newValue)', function() {
                var budget = { "USD/1M": 1000000 };
                var accountName = 'hello';
                it('should return HTTP 200 for the top-level account (callback)', function(done) {
                    mockup.banker.budget(accountName, budget, function(res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.headers).to.include.key({'method-name': 'banker.setBudget'});
                        expect(res.headers).to.include.key({'account-name': accountName});
                        expect(res.headers).to.include.key({'budget': JSON.stringify(budget)});
                        done();                
                    }).on('error', function(err) {
                        should.not.exist(err);
                        done(err);
                    });
                });
                it('Async/await: Should not raise any exceptions for the top-level account', function(done) {
                    !async function() {
                        try {
                            let res = await mockup.banker.budget(accountName, budget);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }();
                });
            });

            describe ('##Banker.Account', function() {
                var accountPath = ["hello", "world"];
                var accountName = accountPath.join(':');

                describe ('.account()', function() {
                    var account;
                    it('should return an object with the proper name (name as a string)', function() {
                        account = mockup.banker.account(accountName);
                        expect(account).to.be.an('object');
                        assert(typeof account.name === 'function', 'account.name should be a function');
                        expect(account.name()).to.be.equal(accountName);
                    });
                    it('should return an object with the proper name (name as array of strings)', function() {
                        account = mockup.banker.account(accountPath);
                        expect(account).to.be.an('object');
                        expect(account.name()).to.be.equal(accountName);
                    });
                });

                describe ('Account.summary()', function() {
                    var accountName = 'hello:world';
                    it('should return an object for a valid name (callback)', function(done) {
                        mockup.banker.account(accountName).summary(function(res) {
                            expect(res).to.have.a.property('statusCode', 200)
                            expect(res.headers).to.include.key({'method-name': 'banker.getAccountSummary'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            expect(res).to.have.a.property('data');
                            let data = (res.data);
                            expect(data).to.be.an('object');
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it('Async/await: should not raise any exceptions', function(done) {
                        !async function() {
                            try {
                                let res = await mockup.banker.account(accountName).summary();
                                done();
                            } catch (err) {
                                done(err);
                            }
                        }();
                    });
                });

                describe ('Account.balance()', function() {
                    var newValue = { "USD/1M": 1000000 };
                    var accountName = 'hello:world';
                    it('should return HTTP 200 for child accounts (callback)', function(done) {
                        mockup.banker.account(accountName).balance(newValue, function(res) {
                            expect(res.statusCode).to.equal(200);
                            expect(res.headers).to.include.key({'method-name': 'banker.setBalance'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            expect(res.headers).to.include.key({'balance': JSON.stringify(newValue)});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it('Async/await: should not raise any exceptions for child accounts', function(done) {
                        !async function() {
                            try {
                                let res = await mockup.banker.account(accountName).balance(newValue);
                                done();
                            } catch (err) {
                                done(err);
                            }
                        }();
                    });
                    it('should return HTTP 400 for top-level accounts (callback)', function(done) {
                        accountName = 'hello'
                        mockup.banker.account(accountName).balance(newValue, function(res) {
                            expect(res.statusCode).to.equal(400);
                            expect(res.headers).to.include.key({'method-name': 'banker.setBudget'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            expect(res.headers).to.include.key({'balance': JSON.stringify(newValue)});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                });

                describe ('Account.children()', function() {
                    var accountName = 'hello:world';
                    it('should return an object (callback)', function(done) {
                        var depth = 3;
                        mockup.banker.account(accountName).children(depth, function(res) {
                            expect(res).to.have.a.property('statusCode', 200)
                            expect(res.headers).to.include.key({'method-name': 'banker.getAccountChildren'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            expect(res.headers).to.include.key({'depth': depth});
                            expect(res).to.have.a.property('data');
                            let data = (res.data);
                            expect(data).to.be.an('object');
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it("Async/await: should not raise any exceptions", function(done) {
                        !async function() {
                            try {
                                let res = await mockup.banker.account(accountName).children();
                                done();
                            } catch (err) {
                                done(err);
                            }
                        }();
                    });
                    it("should substitute depth=10 when it's not specified", function(done) {
                        mockup.banker.account(accountName).children(function(res) {
                            expect(res).to.have.a.property('statusCode', 200)
                            expect(res.headers).to.include.key({'method-name': 'banker.getAccountChildren'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            expect(res.headers).to.include.key({'depth': 10});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                });

                describe ('Account.close()', function() {
                    var accountName = 'hello:world';
                    it('should return HTTP 200 for a valid name (callback)', function(done) {
                        mockup.banker.account(accountName).close(function(res) {
                            expect(res).to.have.a.property('statusCode', 200)
                            expect(res.headers).to.include.key({'method-name': 'banker.closeAccount'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                    it("Async/await: should not raise any exceptions", function(done) {
                        !async function() {
                            try {
                                let res = await mockup.banker.account(accountName).close();
                                done();
                            } catch (err) {
                                done(err);
                            }
                        }();
                    });
                    it('should return HTTP 400 for an invalid name', function(done) {
                        accountName = "invalid:account";
                        mockup.banker.account(accountName).close(function(res) {
                            expect(res).to.have.a.property('statusCode', 400)
                            expect(res.headers).to.include.key({'method-name': 'banker.closeAccount'});
                            expect(res.headers).to.include.key({'account-name': accountName});
                            done();                
                        }).on('error', function(err) {
                            should.not.exist(err);
                            done(err);
                        });
                    });
                });

            });

        });
        //---------------------------------------------------------
        describe('# AdServer Protocol', function() {
            describe('.win()', function() {
                var data = {
                    "timestamp":1365517883.9742889404,
                    "bidRequestId":"4BZkWjMDeAWZ",
                    "impid":"604356",
                    "price":0.8493150684931507,
                    "userIds" : ["some-user-id", "another-user-id"]
                };
                it("Should invoke the proper Mockup's method (callback)", function(done) {
                    mockup.adserver.win(data, function(res) {
                        expect(res).to.have.a.property('statusCode', 200)
                        expect(res.headers).to.include.key({'method-name': 'win'});
                        expect(res.headers).to.include.key({'data': JSON.stringify(data)});
                        done();                
                    }).on('error', function(err) {
                        should.not.exist(err);
                        done(err);
                    });
                });
                it("Promise: Should not raise any exceptions", function(done) {
                    spawn(function* () {
                        try {
                            let res = yield mockup.adserver.win(data);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
        //---------------------------------------------------------
    });
    describe('# HTTP Bidding Agent', function() {
        describe('.biddingAgent()', function() {
            it('should return an object that allows to set up a bid handler', function() {
                expect(rtbkit).to.have.a.property('biddingAgent').which.is.a('function');
                var bidder = rtbkit.biddingAgent();
                expect(bidder).to.have.a.property('bid').which.is.a('function');
            });
        });
    });

});


