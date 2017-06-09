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


const app = require('express')();
const bodyParser = require('body-parser');
//const upload = require('multer')();

//const mockup = require('../lib/mockup')();
const apiFactory = require('../lib/api-factory.js');

app.use(bodyParser.json())

const test_obj = {
    test: "test string",
    int: 123,
    oarr: [ { test: 'test' }, {} ],
    sarr: ["1", "2"]
};

describe ('API', function () {
    //var connect = connector('127.0.0.1');
    const PORT = 10000;
    var server;

    before(function() {
        server = app.listen(PORT, () => {
            console.log(`Mock API listening on http://localhost:${PORT}`);
        });
    });

    after(function() {
        server.close();
        console.log(`Mock API server stopped`);
    });

    var api =  apiFactory('127.0.0.1', PORT, createTestApi);
        it('empty path handler should return "empty path test" ', function(done) {
            api.get('', function(res) {
                expect(res.statusCode).to.equal(200);
                expect(res.data).to.be.equal('empty path test');
                done();
            }).on('error', function(error) {
                should.not.exist(error);
                done(error);
            });
        });
        it('invalid path should raise an error ', function(done) {
            api.get('invalid/path', function(res) {
                should.not.exist(res);
                done(res);
            }).on('error', function(e) {
                should.exist(e);
                done();
            });
        });
        it('string data should be passed as is', function(done) {
            var path = '/v1/mock-api/';
            var body = JSON.stringify(test_obj);
            api.post(path, body, function(res) {
                expect(res.statusCode).to.equal(200);
                var data = JSON.parse(res.data);
                expect(data).to.have.a.property('path', path)
                expect(data).to.have.a.property('request', body);
                //expect(JSON.stringify(JSON.parse(data.request))).to.be.equal(data);
                done();
            }).on('error', function(error) {
                should.not.exist(error);
                done(error);
            });
        });
        it('object data should be stringified', function(done) {
            var path = '/v1/mock-api/';
            var body = test_obj;
            api.post(path, body, function(res) {
                expect(res.statusCode).to.equal(200);
                var data = JSON.parse(res.data);
                expect(data).to.have.a.property('path', path)
                //expect(data.path).to.be.equal();
                expect(data).to.have.a.property('request', JSON.stringify(body));
                done();
            }).on('error', function(error) {
                should.not.exist(error);
                done(error);
            });
        });
});

var s_test_obj = JSON.stringify(test_obj);

function createTestApi(server) {
    return {
        get: function (path, data, callback) {
            return server.get(path, data, callback)
        },
        post: function (path, data, callback) {
            return server.post(path, data, callback)
        }
    }
}


app.get('', function(req, res) {
    res.status(200).end('empty path test');
});

app.post('/v1/mock-api/', function(req, res) {
    var d = {
        path: '/v1/mock-api/',
        request: JSON.stringify(req.body)
    };
    res.status(200).json(d);
});

