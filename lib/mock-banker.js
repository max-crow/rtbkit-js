/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const apiApp = require('./mock-api-app');

 module.exports = apiApp(function(app) {
    var banker = {
        accounts: {
            "hello:world": {},
        }
    };

    app.get('/ping', (req, res) => {
        res.set('method-name', 'banker.ping');
        let data = 'pong';
        res.status(200).json(data);
    });

    app.get('/v1/summary', (req, res) => {
        res.set('method-name', 'banker.summary');
        var summary = {};

        res.status(200).json(summary);
    });

    app.get('/v1/accounts', (req, res) => {
        res.set('method-name', 'banker.accounts');
        var accounts = [];

        res.status(200).json(accounts);
    });

    app.get('/v1/accounts/:name/summary', (req, res) => {
        res.set('method-name', 'banker.getAccountSummary');
        res.set('account-name', req.params.name);
        var account = banker.accounts[req.params.name];
        if(account) {
            res.status(200).json(account);
        } else {
            res.status(400).json(`couldn't get account: ${req.params.name}`);
        }
    });

    app.post('/v1/accounts/:name/budget', (req, res) => {
        res.set('method-name', 'banker.setBudget');
        var accountName = req.params.name
        res.set('account-name', accountName);
        res.set('budget', req.data);

        if(accountName.search(':') === -1) {
            res.status(200).end();
        } else {
            res.status(400).json("can't setBudget except at top level");
        }
    });

    app.post('/v1/accounts/:name/balance', (req, res) => {
        res.set('method-name', 'banker.setBalance');
        var accountName = req.params.name
        res.set('account-name', accountName);
        res.set('balance', req.data);

        if(accountName.search(':') !== -1) {
            res.status(200).end();
        } else {
            res.status(400).json("account has no parent");
        }
    });

    app.get('/v1/accounts/:name/children', (req, res) => {
        res.set('method-name', 'banker.getAccountChildren');
        res.set('account-name', req.params.name);
        res.set('depth', req.query.depth);
        
        var children = {};
        res.status(200).json(children);
        
    });

    app.get('/v1/accounts/:name/close', (req, res) => {
        res.set('method-name', 'banker.closeAccount');
        var accountName = req.params.name
        res.set('account-name', accountName);

        var account = banker.accounts[accountName];
        if(account) {
            res.status(200).end();
        } else {
            res.status(400).json(`couldn't get account: ${accountName}`);
        }
    });

 });

