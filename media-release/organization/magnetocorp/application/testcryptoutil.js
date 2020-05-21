'use strict';


// Bring key classes into scope, most importantly Fabric SDK network class
const assert = require('assert');
const MyCrypto = require('../contract/lib/cryptoutil.js');

const testPrivateKey = 'b605a68ecbb47ec1aa4596d66a5583193796b4390f0e819f9f237d7248ff7c9e';
const testPublicKey = '04c30eb86b6fc77f5caa349f976a3cdfb7ffb93b55b75281ccdf695f78707e6287ef82e9e8622aa5dd01806743094a495e82cbcb8b0501244e5e213630dcada47d';


// Main program function
function main() {
    // Main try/catch block
    try {
        console.log('generateEcdsaFullKey');
        MyCrypto.generateEcdsaFullKey();

        console.log('import keys test');
        let fullKey = MyCrypto.importFromPrivateKey(testPrivateKey);
        let onlyPubKey = MyCrypto.importFromPublicKey(testPublicKey);

        assert.equal(fullKey.getPrivate().toString('hex'), testPrivateKey);
        assert.equal(onlyPubKey.getPublic().encode('hex'), testPublicKey);

        let msg = '123456';
        let contentHash = MyCrypto.hash(msg);
        let signature = MyCrypto.signMsg(contentHash, fullKey);
        // let verifyResult = onlyPubKey.verify(contentHash, signature);
        let verifyResult = MyCrypto.verifySig(signature, contentHash, testPublicKey);
        assert(verifyResult);
    } catch (error) {

        console.log(`Error processing. ${error}`);
        console.log(error.stack);

    } finally {
        console.log('ending');
    }
}
main();
