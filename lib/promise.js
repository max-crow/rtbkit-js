/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const http = require('http');

module.exports.asyncOrPromise = function(callback, functor) {
    if(typeof callback === 'function') {
        return (functor(callback));
    }

    return new Promise( function(resolve, reject) {
        functor(function(res) {
            if(Math.floor(res.statusCode/100) !== 2) {
                var err = new Error(`HTTP ${res.statusCode} - ${http.STATUS_CODES[res.statusCode]}. data: '${JSON.stringify(res.data)}'`);
                reject(err);
            }
            // if(res.statusCode == 204) {
            //     res.data = null;
            // }
            resolve(res.data);
        }).on('error', function (err) {
            reject(new Error(err));
        });
    });
};

module.exports.spawn = function (generatorFunc) {
  function continuer(verb, arg) {
    var result;
    try {
      result = generator[verb](arg);
    } catch (err) {
      return Promise.reject(err);
    }
    if (result.done) {
      return result.value;
    } else {
      return Promise.resolve(result.value).then(onFulfilled).catch(onRejected);
    }
  }
  var generator = generatorFunc();
  var onFulfilled = continuer.bind(continuer, "next");
  var onRejected = continuer.bind(continuer, "throw");
  return onFulfilled();
}
