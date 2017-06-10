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
const chaiAsPromised = require("chai-as-promised"); 
chai.use(chaiAsPromised);

const mockupServer = require('../lib/mockup')();
const rtbkit = require('../lib/rtbkit.js')
    , mockup = rtbkit.instance('127.0.0.1')
    , spawn = rtbkit.spawn
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
            it('should return a JSON array (async)', function(done) {
                mockup.acs.getAgents(function(res) {
                    expect(res.statusCode).to.equal(200);
                    let agents = JSON.parse(res.data);
                    expect(agents).to.be.an('Array');
                    done();                
                }).on('error', function(e) {
                    should.not.exist(error);
                    done(error);
                });
            });
            it('should return a JSON array (Promise)', function(done) {
                spawn(function* () {
                    try {
                        let res = yield mockup.acs.getAgents();
                        expect(res).to.have.a.property('statusCode', 200)
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
    });
});


