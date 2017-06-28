/*!
 * rtbkit-js
 * Copyright(c) 2017 Maksim G. Voronin <maxgcrow@gmail.com>
 * MIT Licensed
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')();

module.exports = createInstance;

function createInstance() {
    const app = express();
    app.use(bodyParser.json())

    var onBid = null;
    // var onImp = null;

    var rootHandler = function(req, res, next) {
        var breq = req.body;
        var bres = {
            id: breq.id,
            seatbid: [ {
                seat: /*(breq.wseat)? breq.wseat[0] :*/ undefined,  
                bid: []
            }]
        };

        if(!onBid) {
            res.sendStatus(204);
            return;
        }

        // if(!breq.wseat || breq.wseat.length === 0) {
        //     breq.wseat = [undefined];
        // }
        var bids = [];
        var errors = [];

        var processBid = function(bid) {
            bids.push(bid);
        };
        // console.log(`------> '${JSON.stringify(breq)}'`)
        for(var imp of breq.imp) {
            //console.log(`-----  imp ----- '${JSON.stringify(imp)}'`)
            for(var campaign of imp.ext['external-ids']) {
                var bid = onBid(breq);
                //console.log(`------ return '${bid}'`)
                if(bid === undefined) {
                    var err = "a bid handler returned 'undefined'";
                    //console.error(err);
                    errors.push(err);
                } 
                else if(bid !== null) {
                    if(typeof bid === 'object') {
                        processBid(bid);
                    } else {
                        var err = `a bid handler returned a non-object (${typeof bid})`;
                        //console.error(err);
                        errors.push(err);
                    }
                }
            }
        }

        if(bids.length > 0) {
            bres.seatbid[0].bid = bids;
            res.status(200).json(bres);
            return;
        }
        if(errors.length > 0) {
            res.status(500).json(errors);
            return;
        }        
        res.sendStatus(204);
        //res.sendStatus(501);
    }
   
    return {
        bid: (callback) => {
            onBid = callback;
        }, 
        // imp: (callback) => {
        //     onImp = callback;
        // },
        listen: (port, path) => {
            app.post(path, upload.array(), rootHandler);

            app.listen(port);
        }
    };
}
