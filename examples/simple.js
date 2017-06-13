const rtbkit = require('../index.js');

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
;


var host;

if(process.argv.length < 3) {
    console.log("No instance specified. Launching local Mockup.")
    rtbkit.mockup.start();
    host = '127.0.0.1';
} else {
    console.log("instance specified")
    host = process.argv[2];
}


async function main() {
    try {
        const rtb = rtbkit.instance(host)
            , banker = rtb.banker
            , acs = rtb.acs
        ;

        var amount = { "USD/1M": 1000000 };
        await banker.budget("hello", amount);
        await banker.account('hello:world').balance(amount);

        var accounts = await banker.accounts();
        console.log(`accounts: ${JSON.stringify(accounts)}`);
        for(let i in accounts) {
            var account = banker.account(accounts[i]);
            console.log(`${JSON.stringify(accounts[i])} - ${account.name()}`);

            console.log(JSON.stringify(await account.summary(), 3));
            console.log('\n\n\n');
        }


        var agents = await acs.agents();
        console.log(`Agents: ${JSON.stringify(agents)}`);
        
    } catch (err) {
        console.log(`ERR: ${err}`);
    }
}

main().then(res => { 
    rtbkit.mockup.stop(); 
});
