const rtbkit = require('rtbkit-js');
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