'use strict';


// Bring key classes into scope, most importantly Fabric SDK network class
const assert = require('assert');
// const { Wallets, Gateway } = require('fabric-network');
// const Editor = require('../contract/lib/editor.js');
// const Reporter = require('../contract/lib/reporter.js');
// const Clue = require('../contract/lib/clue.js');
// const VersionHead = require('../contract/lib/versionhead.js');
// const Material = require('../contract/lib/material.js');

const crypto = require('crypto');
const elliptic = require('elliptic');

const EC = elliptic.ec;

const ecdsa = new EC(elliptic.curves.p256);
let ecdsaKey = ecdsa.genKeyPair();
let pub = ecdsaKey.getPublic();
pub.encode('hex');
let priv = ecdsaKey.getPrivate();
priv.toString('hex');
ecdsa.keyFromPrivate(priv.toString('hex'), 'hex')

const testPrivateKey = 'b605a68ecbb47ec1aa4596d66a5583193796b4390f0e819f9f237d7248ff7c9e';
const testPublicKey = '04c30eb86b6fc77f5caa349f976a3cdfb7ffb93b55b75281ccdf695f78707e6287ef82e9e8622aa5dd01806743094a495e82cbcb8b0501244e5e213630dcada47d';


function generateEcdsaFullKey() {
    let ecdsaKey = ecdsa.genKeyPair();
    console.log(`public key:\n ${ecdsaKey.getPublic().encode('hex')}`);
    console.log(`private key:\n ${ecdsaKey.getPrivate().toString('hex')}`);
    return ecdsaKey;
}

// ppp = ecdsa.keyFromPublic('04c30eb86b6fc77f5caa349f976a3cdfb7ffb93b55b75281ccdf695f78707e6287ef82e9e8622aa5dd01806743094a495e82cbcb8b0501244e5e213630dcada47d', 'hex')
function hash(message) {
    const hash1 = crypto.createHash('sha256');
    hash1.update(message);
    return hash1.digest('hex');
}

function importFromPrivateKey(privString) {
    // let ecdsa = new EC(elliptic.curves.p256);
    return ecdsa.keyFromPrivate(privString, 'hex');
}

function importFromPublicKey(pubString) {
    return ecdsa.keyFromPublic(pubString, 'hex');
}

function signMsg(msg, key) {
    return elliptic.utils.toHex(ecdsa.sign(msg, key).toDER());
}

// Main program function
function main() {
    // Main try/catch block
    try {
        console.log('generateEcdsaFullKey');
        generateEcdsaFullKey();

        console.log('import keys test');
        let fullKey = importFromPrivateKey(testPrivateKey);
        let onlyPubKey = importFromPublicKey(testPublicKey);

        assert.equal(fullKey.getPrivate().toString('hex'), testPrivateKey);
        assert.equal(onlyPubKey.getPublic().encode('hex'), testPublicKey);

        let msg = '123456';
        let contentHash = hash(msg);
        let signature = signMsg(contentHash, fullKey);
        let verifyResult = onlyPubKey.verify(contentHash, signature);
        assert(verifyResult);
    } catch (error) {

        console.log(`Error processing. ${error}`);
        console.log(error.stack);

    } finally {
        console.log('ending');
    }
}
main();
