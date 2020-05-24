/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';


// Bring key classes into scope, most importantly Fabric SDK network class
const elliptic = require('elliptic');
const EC = elliptic.ec;
const ecdsa = new EC(elliptic.curves.p256);

const fs = require('fs');
const fse = require('fs-extra');
const demoutil = require('./demoutil.js');


// const MyCrypto = require('../contract/lib/cryptoutil.js');

process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
});

let reporterName = process.argv[2];

function writJson2File(path, content) {
    fse.writeJSONSync(path, content);
}

function readJsonFromFile(path) {
    return fse.readJSONSync(path);
}

function getUserCfgPath(username) {
    return `/home/zy/demo/${username}.json`;
}

function generateReporterKey(name) {
    let ecdsaKey = ecdsa.genKeyPair();
    let outPubKey = ecdsaKey.getPublic().encode('hex');
    let outPrivKey = ecdsaKey.getPrivate().toString('hex');
    console.log(`generate ecdsa keypair for ${name}:\n pubic key is:  ${outPubKey}\n private key is ${outPrivKey}`);

    let obj = { username: name, publicKey: outPubKey, privateKey: outPrivKey };
    writJson2File(getUserCfgPath(name), obj);
}

function reporterApply(reporterName, mcAddress, globalID, timestamp, identityCard) {

}

generateReporterKey(reporterName);
let obj = readJsonFromFile(getUserCfgPath(reporterName));
console.log(obj);
/*
function generateReporterInfo() {
    let ecdsaKey = ecdsa.genKeyPair();
    let outPubKey = ecdsaKey.getPublic().encode('hex');
    let outPrivKey = ecdsaKey.getPrivate().toString('hex');


    // mcAddress, currentState, globalID, email, phone, identityCard, signature
    let mcAddress = outPubKey;
    let globalID = 'reporter0001';
    let timestamp = '18812345678';
    let identityCard = '110011199001011234';

    let reporter = Reporter.createInstance(mcAddress, 'active', globalID, 'email', phone, identityCard, timestamp);

    reporter.setSignature(MyCrypto.signMsg(reporter.getMsgHash(), MyCrypto.importFromPrivateKey(reporterPrivateKey)));
    return retReporter;
}
*/