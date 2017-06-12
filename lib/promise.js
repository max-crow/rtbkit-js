/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

//const Promise = require('es6-promise').Promise

module.exports.asyncOrPromise = function(callback, functor) {
    if(typeof callback === 'function') {
        return (functor(callback));
    }
    // return new Promise( (resolve, reject) => {
    //     functor((res) => {
    //         resolve(res);
    //     }).on('error', (err) => {
    //         reject(Error(err));
    //     });
    // });
    return new Promise( function(resolve, reject) {
        functor(function(res) {
            resolve(res);
        }).on('error', function (err) {
            reject(Error(err));
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
