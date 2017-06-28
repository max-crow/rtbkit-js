
# Changelog

## v0.2.0 (2017-06-)  
### Added
#### HTTP Bidding Agent
* rtbkit.biddingAgent()

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

#### Tests
* [Mocha]
* [Chai]


[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Mocha]: https://mochajs.org/
[Chai]: http://chaijs.com/