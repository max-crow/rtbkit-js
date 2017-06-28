/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const bidder = require('../lib/http-bidding-agent')();

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert
;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const http = require('http');
const net = require('net'); 

const PORT = 7654;
const PATH = '/auctions';

const BR = {
    'bsw': () => { return {"id":"81d8e83a-9f33-4269-8279-8bc37c09556a","site":{"id":"rubicon_47400","publisher":{"name":"","id":"rubicon_10336"},"name":"eBay Kleinanzeigen Layer 1","cat":["IAB22"],"domain":"ebay-kleinanzeigen.de","ext":{},"page":"https://www.ebay-kleinanzeigen.de/s-anzeige/opel-corsa-b-automatik-fahrbereit/473172209-216-16344"},"wseat":["123"],"user":{"ext":{"ug":0}},"device":{"connectiontype":0,"model":"iPad","language":"ar","geo":{"country":"DE","city":"Munich","region":"02","zip":"80469"},"make":"Apple","osv":"9.3.2","os":"iOS","devicetype":1,"ip":"85.181.122.114","js":1,"ua":"Mozilla/5.0 (iPad; CPU OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1"},"tmax":101,"cur":["USD"],"imp":[{"bidfloor":0.003,"id":"1","banner":{"pos":3,"topframe":0,"h":250,"battr":[1,3,8,9,10,13,14],"w":300,"btype":[1]},"exp":300,"tagid":"rubicon_412600","bidfloorcur":"USD","ext":{"rubicon":{"site_size_session_count":0}},"secure":1,"iframebuster":["mm","af","dc","ft"],"instl":0}],"bcat":["IAB26","BSW4","IAB25-3","IAB7","BSW2","BSW10","BSW1","IAB7-17"],"ext":{"is_secure":1,"wt":1,"clktrkrq":0,"ssp":"rubicon"},"at":2}; },
    'http': function(options) {
        var br = this.bsw();
        if(!options) {
            br.imp[0].ext["external-ids"] = [0];
        } else {
            if (options.imp !== undefined && options.imp === 0)  {
                br.imp = [];
                return br;
            } 
            options.imp = options.imp || 1;
            if (options.campaigns === undefined) {
                options.campaigns = 1; 
            }
            if (options.campaigns) {
                if(br.imp[0].ext === undefined) {
                    br.imp[0].ext = {};
                }
                let ids = [];
                br.imp[0].ext["external-ids"] = ids;
                for(let i = 0; i<options.campaigns; ++i) {
                    ids.push(i);
                }
            }
            while (br.imp.length < options.imp) {
                br.imp.push(br.imp[0]);
            }
        }
        return br;
    }
}

describe ('HTTP Bidding Agent', function () {
    describe ('.listen()', function(done) {
        it('should start to listen the specified port on localhost', function(done){
            bidder.listen(PORT, PATH);
            var server = net.createServer()
            .once('error', function(err){
                expect(err.code).to.equal('EADDRINUSE');
                done();
            }).listen(PORT, function() {
                server.close();
                done("Bidder doesn't listen the port");
            })
        });
        it('should return HTTP 204', function(done){
            post({}, function(res) {
                expect(res.statusCode).to.equal(204);
                done();
            }).on('error', function (err) {
                should.not.exist(err);
                done(err);
            });
        })
    });   
    describe.skip ('.imp()', function() {
        describe('should call the handler once for each br.imp[]', function() {
            var bidRequest = BR.http();
            var testImp = function(){
                var bid = null;
                var cb = sinon.stub().returns(bid);
                bidder.imp(cb);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(cb.callCount).to.be.equal(bidRequest.imp.length);
                    done();
                }).on('error', function (err) {
                    done(err);
                });
            }
            it('imp.size == 1', testImp);
        })
    });
    describe('.bid()', function() {
        describe('should call the handler once for each br.imp[].ext.external-ids[]', function() {
            var testBid = function(impLen, idLen) {
                it(`imp.size = ${impLen} external-ids.size = ${idLen}`, function(done) { 
                    var bidRequest = BR.http({imp: impLen, campaigns: idLen});
                    var cb;
                    cb = sinon.stub().returns(null);
                    bidder.bid(cb);
                    post(bidRequest, function(res) {
                        expect(res.statusCode).to.equal(204, `data: '${res.data}'`);
                        expect(cb.callCount).to.be.equal(impLen * idLen);
                        done();
                    }).on('error', function (err) {
                        done(err);
                    });
                });
            }
            for(var impLen of [0, 1, 3, 7]) {
                for(var idLen of [1, 2]) {
                    testBid(impLen, idLen);
                }
            }
        })
        describe('# return value', function() {
            it('return object == bid', function(done) {
                var bidRequest = BR.http();
                
                var bid = {price: 1};
                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(200, `data: '${res.data}'`);
                    done();
                }).on('error', function (err) {
                    done(err);
                });
            });
            it('return undefined == error', function(done){
                var bidRequest = BR.http();
                
                var cb = sinon.stub().returns(undefined);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(500);
                    assert(res.data.indexOf('undefined') !== -1, 'response data do not contain error description');
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return null == no-bid', function(done){
                var bidRequest = BR.http();
                
                var cb = sinon.stub().returns(null);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(204);
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return non-object == error', function(done){
                var bidRequest = BR.http();
                
                var bid = "string";
                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(500);
                    assert(
                        res.data.indexOf('object') !== -1
                            && res.data.indexOf(typeof bid) !== -1, 
                        'response data do not contain error description'
                    );
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return [error, error] == [error, error]', function(done){
                var bidRequest = BR.http({imp: 2});
                
                var cb = sinon.stub().returns(undefined);
                bidder.bid(cb);
                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(500);
                    var errors = JSON.parse(res.data);
                    expect(errors).to.be.an('array').with.length(2);
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return [no-bid, error] == [error]', function(done){
                var bidRequest = BR.http({imp: 2});
                
                var cb = sinon.stub();
                cb.onCall(0).returns(null);
                cb.onCall(1).returns(undefined);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(500);
                    var errors = JSON.parse(res.data);
                    expect(errors).to.be.an('array').with.length(1);
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return [no-bid, bid, error, bid, ...] == [bid]', function(done){
                var bidRequest = BR.http({imp: 5});
                
                var cb = sinon.stub();
                cb.onCall(0).returns(null);
                cb.onCall(1).returns({});
                cb.onCall(2).returns(undefined);
                cb.onCall(3).returns({});
                cb.returns(null);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(200);
                    var bres = JSON.parse(res.data);
                    expect(bres).to.be.an('object')
                        .that.has.a.nested.property('seatbid[0].bid')
                        .that.is.an('array').with.length(2);
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
        });
        describe('should pass proper arguments into the handler', function() {
            it('return object == bid', function(done) {
                var cb = sinon.stub().returns(null);
                bidder.bid(cb);

                var bidRequest = BR.http();
                post(bidRequest, function(res) {
                    cb.should.be.calledWith(bidRequest);
                    done();
                }).on('error', function (err) {
                    done(err);
                });
            });

        });
/*        describe.skip('should check if the handler returns a valid type value:', function() {
            it('return undefined == error', function(done){
                var bidRequest = BR.http();
                var handlerCalled = false;
                
                bidder.bid((campaignId, breq, imp, creativeList, seat)=> {
                    handlerCalled = true;
                    expect(breq).to.deep.equal(bidRequest);
                });

                post(bidRequest, function(res) {
                    expect(handlerCalled, 'handler has not been called').to.be.true;
                    expect(res.statusCode).to.equal(500);
                    assert(res.data.indexOf('undefined') !== -1, 'response data do not contain error description');
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return null == no-bid', function(done){
                var bidRequest = BR.http;
                var handlerCalled = false;
                
                var cb = sinon.stub().returns(null);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    cb.should.have.been.calledWith(undefined, bidRequest);
                    expect(res.statusCode).to.equal(204);
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return non-object == error', function(done){
                var bidRequest = BR.http();
                var handlerCalled = false;
                
                var bid = "string";
                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    cb.should.have.been.calledWith(undefined, bidRequest);
                    expect(res.statusCode).to.equal(500);
                    assert(
                        res.data.indexOf('object') !== -1 && 
                            res.data.indexOf(typeof bid) !== -1, 
                        'response data do not contain error description'
                    );
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            it('return object == bid', function(done){
                var bidRequest = BR.http();
                var handlerCalled = false;
                
                var bid = {price: 1};
                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);

                post(bidRequest, function(res) {
                    cb.should.have.been.calledWith(bidRequest.wseat[0], bidRequest);
                    expect(res.statusCode).to.equal(200, `data: '${res.data}'`);
                    var bidResponse = JSON.parse(res.data);
                    expect(bidResponse).to.be.an('object').which.has.a.property('id', bidRequest.id);
                    expect(bidResponse).to.have.a.nested.property('seatbid[0]').that.satisfy((seatbit) => {
                        expect(seatbit).to.have.a.property('seat', bidRequest.wseat[0]);
                        expect(seatbit).to.have.a.property('bid')
                            .that.is.an('array')
                            .and.have.a.nested.property('[0]');
                        return true;
                    });
                    // expect(bidResponse).to.have.a.property('seatbid').that.satisfy((seatbid)=> {
                    //     for(var sb in seatbid) {
                    //             expect(sb).to.have.a.property('seat').that.satisfy((seat)=> {
                    //             return false;
                    //         })
                    //     }
                    // });
                    done();
                }).on('error', function (err) {
                    should.not.exist(err);
                    done(err);
                });
            });
            
        });
*/
    });
});

const post = (data, callback) => {
    return send('POST', PORT, PATH, data, callback);
}

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

