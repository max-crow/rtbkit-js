
# Changelog

## v0.3.0 (2017-10-28)  
### Added
#### AdServer API (Post-Auction Loop)
* rtbkit.adserver.win(data)

### Fixed
* bid.ext.priority's default value of 1

#### Examples
* nurl-proxy.js - An HTTP Proxy that converts HTTP post-auction GET requests into the RTBkit's [Standard Ad Server Protocol]


## v0.2.0 (2017-06-29)  
### Added
#### HTTP Bidding Agent
* rtbkit.biddingAgent()
* bid( (externalId, creatives, bidRequest, imp) => {price, crid, ext.priority} )

#### Examples
* bidder.js - HTTP Bidding Agent

#### Tests
* [Sinon.JS]
* [Sinon-Chai]

## v0.1.0 (2017-06-14)  
### Added
#### Agent Configuration Service
* agents()
* agent(name)
* Agent.config()
* Agent.config(newValue)

#### Banker API
* ping()
* summary()
* budget(newValue)
* accounts()
* account(name)
* Account.balance(newValue)
* Account.children()
* Account.close()

#### Promise
* Functions return [Promises] when the callback is no specified.
* rtbkit.spawn for ES6 generators (synchronous-like mode with yield).

#### Examples
* simple.js

#### Tests
* [Mocha]
* [Chai]


[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Mocha]: https://mochajs.org/
[Chai]: http://chaijs.com/
[Sinon.JS]: http://sinonjs.org/
[Sinon-Chai]: https://github.com/domenic/sinon-chai
[Standard Ad Server Protocol]: https://github.com/rtbkit/rtbkit/wiki/Standard-Ad-Server-Protocol