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
//const http = require('http');
const net = require('net'); 

const apiApp = require('../lib/mock-api-app.js');
const http = require('http');

const PORT = 11000;
const PATH = '/testing-path/'

describe ('Mock API Application', function () {
    var api = apiApp(function(app){
        app.get(PATH, function(req, res) {
            res.sendStatus(200);
        });
    });
    describe('.start()', function() {
        it('should start to listen the specified port on localhost', function(done){
            api.start(PORT);
            var server = net.createServer()
            .once('error', function(err){
                expect(err.code).to.equal('EADDRINUSE');
                done();
            }).listen(PORT, function() {
                server.close();
                done("Api doesn't listen the port");
            })
        });
    });
    describe('.constructor()', function() {
        it('the specified handlers should work', function(done) {
            http.get(`http://127.0.0.1:${PORT}${PATH}`, (res) => {
                expect(res.statusCode).to.equal(200);   
                done();
            }).on('error', (err) => {
                should.not.exist(err);
                done(err);
            });
        });
    });
    describe('.stop()', function() {
        it('should release the taken port', function(done){
            api.stop();
            var server = net.createServer()
            .once('error', function(err){
                should.not.exist(err);
                done(err);
            }).listen(PORT, function() {
                done();
                server.close();
            })
        });
    });
});

