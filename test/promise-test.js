/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const promise = require('../lib/promise')
    , invoke = promise.asyncOrPromise
    , spawn = promise.spawn
;

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
;


const remoteAsync = {
    raiseError: function(param, successCallback) {    
        return {
            on: function(event, errorCallback) {
                errorCallback(param);
            }
        };
    },

    successCall: function(param, successCallback) {    
        successCallback(param);
        return {
            on: function(event, errorCallback) {
            }
        };
    }
};

const testClient = {
    lastParam: undefined,
    successCall: function (param, callback) {
        var self = this;
        return invoke(callback, function(callback) {
            self.lastParam = param;
            return remoteAsync.successCall(self.lastParam, callback);
        });
    },

    raiseError: function (param, callback) {
        return invoke(callback, (callback) => {
            this.lastParam = param;
            return remoteAsync.raiseError(this.lastParam, callback);
        });
    }
};

describe('Conditional Promise Wrapper', function() {
    describe('#testClient.successCall (functor implemented as function)', function() {
        it('callback: should call the provided success callback function', function(done) {
            testClient.successCall('test-value', function(res){
                expect(res).to.equal(testClient.lastParam);
                done();
            }).on('error', function(err){
                should.not.exist(err);
                done(err);
            });
        });
        it('callback: should call the provided success callback lambda', function(done) {
            testClient.successCall('test-value', (res) => {
                expect(res).to.equal(testClient.lastParam);
                done();
            }).on('error', (err) => {
                should.not.exist(err);
                done(err);
            });
        });
        it('Promise: should not raise any exception when statusCode is 2xx', function(done) {
            spawn(function* () {
                try {
                    var res = yield testClient.successCall({statusCode: 204, data: 'promise'});
                    expect(res).to.equal(testClient.lastParam.data);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('#testClient.raiseError (functor implemented as lambda)', function() {
        it('callback: should call the provided error callback function', function(done) {
            testClient.raiseError('test-value', function(res){
                should.not.exist(res);
                done(res);
            }).on('error', function(err){
                expect(err).to.equal(testClient.lastParam);
                done();
            });
        });
        it('callback: should call the provided error callback lambda', function(done) {
            testClient.raiseError('test-value', (res) => {
                should.not.exist(res);
                done(res);
            }).on('error', (err) => {
                expect(err).to.equal(testClient.lastParam);
                done();
            });
        });
        it('Promise: should work with yield and raise an exception when error', function(done) {
            spawn(function* () {
                try {
                    var res = yield testClient.raiseError({statusCode: 400, data: 'promise'});
                    done(res);
                } catch (err) {
                    done();
                }
            });
        });
        it('Promise: should raise an exception when statusCode is not 2xx', function(done) {
            spawn(function* () {
                try {
                    var res = yield testClient.successCall({statusCode: 400, data: 'promise'});
                    done(res);
                } catch (err) {
                    done();
                }
            });
        });

    });

    describe('#Promise', function() {
        it('should execute a chain of calls', function(done) {
            spawn(function* () {
                try {
                    var res = yield testClient.successCall({statusCode: 200, data: 'promise-200'});
                    expect(res).to.equal(testClient.lastParam.data);
                    res = yield testClient.successCall({statusCode: 204, data: 'promise-204'});
                    expect(res).to.equal(testClient.lastParam.data);
                    res = yield testClient.raiseError({statusCode: 400, data: 'error-test'});
                    should.not.exist(res);
                } catch (err) {
                    done();
                }
            });
        });
    });

});