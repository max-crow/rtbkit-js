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
            br.imp[0].ext["creative-ids"] = {"0": 0};
        } else {
            if (options.imp !== undefined && options.imp === 0)  {
                br.imp = [];
                return br;
            } 
            options.imp = options.imp || 1;
            if (options.campaigns === undefined) {
                options.campaigns = 1; 
            }
            let ids = [];
            if (options.campaigns) {
                if(Array.isArray(options.campaigns)) {
                    ids = options.campaigns;
                } else {
                    for(let i = 0; i<options.campaigns; ++i) {
                        ids.push(i);
                    }
                }

                br.imp[0].ext == br.imp[0].ext || {};
                br.imp[0].ext["external-ids"] = ids;                
            }
            if (options.creatives === undefined) {
                options.creatives = {};
                for(let id of ids) {
                    options.creatives[id] = [0]; 
                }
            }
            if (options.campaigns && options.creatives) {
                //br.imp[0].ext == br.imp[0].ext || {};
                let creatives = {};
                for(let id of ids) {
                    creatives[id] = options.creatives[id];
                }
                br.imp[0].ext['creative-ids'] = creatives;                
            }
            while (br.imp.length < options.imp) {
                var imp  = JSON.parse(JSON.stringify(br.imp[0]));
                imp.id = imp.id + br.imp.length;
                br.imp.push(imp);
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
        it('should pass proper arguments into the handler', function(done) {
            var cb = sinon.stub().returns(null);
            bidder.bid(cb);

            var campaigns = [0, 1, 1555];
            var creatives = {"0": [0], "1": [1], "1555": [3]};
            var bidRequest = BR.http({imp: 2, campaigns: campaigns, creatives: creatives});
            post(bidRequest, function(res) {
                for (let imp of bidRequest.imp) {
                    for (let c of campaigns) {
                        cb.should.be.calledWith(c, creatives[c], bidRequest, imp);
                    }
                }
                done();
            }).on('error', function (err) {
                done(err);
            });
        });
        describe('# bid data', function() {
            it('should return the bid', function(done) {
                var bid = {
                    id: 'qwerty1234567890',
                    impid: 'imp.id',
                    price: 12345,
                    crid: 'bid.crid',
                    ext: {
                        'external-id': 'external-id',
                        'priority': 'bid.priority'
                    }
                };
                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);

                var bidRequest = BR.http();
                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(JSON.parse(res.data))
                        .to.have.a.nested.property('seatbid[0].bid[0]')
                            .that.deep.equal(bid)
                    ;
                    done();
                }).on('error', function (err) {
                    done(err);
                });
            });
            it('should fill down bid.id, bid.impid, bid.ext.external-id, and bid.ext.prority=1 automatically if missed', function(done) {
                var campaigns = [0];
                var bidRequest = BR.http({campaigns: campaigns});

                var bid = {
                    price: 12345,
                    crid: 'bid.crid',
                };
                var rbid = JSON.parse(JSON.stringify(bid));
                rbid.impid = bidRequest.imp[0].id;
                rbid.ext = {};
                rbid.ext['external-id'] = campaigns[0];
                rbid.ext.priority = 1;
                rbid.id = `${bidRequest.id}:${rbid.impid}:${rbid.ext['external-id']}`;

                var cb = sinon.stub().returns(bid);
                bidder.bid(cb);
                post(bidRequest, function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(JSON.parse(res.data))
                        .to.have.a.nested.property('seatbid[0].bid[0]')
                            .that.deep.equal(rbid)
                    ;
                    done();
                }).on('error', function (err) {
                    done(err);
                });
            });
        });
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

