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

//var chaiAsPromised = require("chai-as-promised");

const mockup = require('../lib/mockup')();
const rtbkit = require('../lib/rtbkit.js').instance('127.0.0.1');

describe ('RTBkit', function () {
    before(function() {
        mockup.start();
    });

    after(function() {
        mockup.stop();
    });
    describe('#Agent Config Service', function() {
        describe ('.getAgents()', function() {
            it('should return a JSON array', function(done) {
                rtbkit.acs.getAgents(function(res) {
                    expect(res.statusCode).to.equal(200);
                    let agents = JSON.parse(res.data);
                    expect(agents).to.be.an('Array');
                    done();                
                }).on('error', function(e) {
                    should.not.exist(error);
                    done(error);
                });
            });
        });
    });
});


