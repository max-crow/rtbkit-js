# rtbkit.js
Access RTBkit APIs easily with [Node.js]

## Installation
rtbkit.js is available on [npm]. To install it, type:

    $ npm install rtbkit-js

## Usage

```js
const rtbkit = require('rtbkit-js');
```

Now we can :
* launch an HTTP bidding agent, or
* connect to an RTBkit instance to work with its RESTful APIs

### HTTP Bidding Agent
You may create an HTTP Bidding Agent just typing a few strings:
```js
const bidder = rtbkit.biddingAgent();

var PORT = 7654;
var PATH = '/auctions';

bidder.bid(function(campaign, creatives, bidRequest, imp) {
    if (campaign == 111) {
        return null;            // no-bid
    }
    return { 
        price: 0.1,             // bid CPM
        crid: creatives[0],     // bid with the first allowed creative
        ext: { priority: 1 }    // (optional)
    };
});

bidder.listen(PORT, PATH);
```

This bidder will response with no-bids for the campaign 111 (external-id from the bidding agent config) and will bid with 0.1 CPM for all other campaigns.

The library will automatically fill down bid.id, bid.impid, and bid.ext.external-id fields.

The function will be called once for each imp item and each allowed campaign that have been specified by RTBkit in the bid request.


### RTBkit RESTful APIs

To connect to an RTBkit inststance type:
```js
const rtb_test = rtbkit.instance("127.0.0.1");
const banker = rtb_test.banker;
const acs = rtb_test.acs;
```

#### Async/await
rtbkit.js might be used with the [await] operator in [async] functions:

```js
async function main() {
    try {   
        var pong = await banker.ping();
        console.log(pong);

    } catch (err) {
        console.log(`ERR: ${err}`);
    }
}
main();
```
#### Callbacks
Or you can use a traditional callback approach. In this case you will have access to the [HTTP Response](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage)  object:

```js
!function main() {
    banker.ping(function(res) {
        console.log(`OK (${res.statusCode}): ${res.data}`);
    }).on('error', function(err) {
        console.log(`FAIL: ${err}`);
    });
}();
```

### APIs

#### [Banker API]
Budgets management:

```js
var pong = await banker.ping();
var summary = await banker.summary(); //gets information about all accounts
await banker.budget('hello', newValue); // sets a new value for a top-level account
var accounts = await banker.accounts(); // lists all accounts
var account = banker.account('hello:world');    // makes a reference to the specified account. 
                                                // It's an ordinary synchronous method, you don't need use await here.
var hello_world = banker.account(['hello', 'world']) // the same as the previous call
await account.balance(newValue);   // transfers budget from the parent account to set the new value. Unacceptable for top-level accounts.
var childrens = await account.children(); // gets descendants of the account
await account.close(); // closes the account and all its childs.
```

### Agent Configuration Service (ACS) API
```js
var agents = await acs.agents(); // lists all agents
var agent = acs.agent(agents[0]);   // makes a reference to the specified agent. 
                                    //It's an ordinary synchronous method, you don't need use await here.
var config = await agent.config();  //gets the bidding agent's config
await agent.config(newAgentConfig); // sets the new configuration for the bidding agent
```

### Post Auction Events (a-ka [Standard Ad Server Protocol])
With the Ad Server protocol we may implement a win notification proxy that recieves GET requests 
from the browser and sends POST requests into the RTBkit's via Standard Ad Server Protocol:

```js
const app = require('express')();
const rtbkit = require('rtbkit-js');

const PORT = 888;

const RTBKIT_HOST = '127.0.0.1';

const adserver = rtbkit.instance(RTBKIT_HOST).adserver;

app.get('/win', function (req, response) {
    var data = {
        timestamp: Date.now() / 1000,
        bidRequestId: req.query.brid,
        impid: req.query.impid,
        price: parseFloat(req.query.price)
    };

    adserver.win(data, function(res) {
        console.log(`win notice (${res.statusCode}): '${JSON.stringify(data)}'`);
        response.status(res.statusCode).end();
    }).on('error', function(err) {
        console.log(`win notice error '${err.message}': '${JSON.stringify(data)}'`);
        response.status(500).end();
    });
});


app.listen(PORT, function(){
    console.log(`nurl proxy server listing on: http://localhost:${PORT}`);
});

```

Other events (clicks, conversions) will be implemented later.  


#### Exchange Endoints
Will be implemented later.  Will help to send bid requsts into the system and check responses.

### RTBkit Mock-up 
There is a mock server that emulates all implemented APIs. It starts locally always.

```js

async function main() {
    try {   
        rtbkit.mockup.start();

        const banker = rtbkit.instance('127.0.0.1').banker

        var pong = await banker.ping();
        console.log(pong);

    } catch (err) {
        console.log(`ERR: ${err}`);
    }
}

main().then(res => { 
    rtbkit.mockup.stop(); 
});
```

[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
[async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[Banker API]: https://github.com/rtbkit/rtbkit/wiki/Banker-JSON-API
[HTTP Bidding Agents]: https://github.com/rtbkit/rtbkit/wiki/HttpBidderInterface
[Standard Ad Server Protocol]: https://github.com/rtbkit/rtbkit/wiki/Standard-Ad-Server-Protocol