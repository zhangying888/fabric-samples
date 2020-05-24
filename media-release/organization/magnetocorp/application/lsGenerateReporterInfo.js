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
const Reporter = require('../contract/lib/reporter.js');

const MyCrypto = require('../contract/lib/cryptoutil.js');

process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
});

const argvUserName = 'yueyunpeng';
const argvGlobalId = 'mediachain0001';
const argvIdentityCard = '110011199606061234';

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

function reporterApply(reporterName, globalID, identityCard) {
    console.log('报道员在安全的环境下生成自己用于签名的公私钥，是报道员区块链身份的象征');
    let ecdsaKey = ecdsa.genKeyPair();
    let outPubKey = ecdsaKey.getPublic().encode('hex');
    let outPrivKey = ecdsaKey.getPrivate().toString('hex');
    console.log(`generate ecdsa keypair for ${reporterName}:\n pubic key is:  ${outPubKey}\n private key is ${outPrivKey}`);

    console.log('报道员使用私钥签名申请的时候关键字段');
    let mcAddress = outPubKey;
    // let globalID = 'reporter0001';
    let timestamp = demoutil.getDateTime();
    // let identityCard = '110011199001011234';

    let reporter = Reporter.createInstance(mcAddress, 'active', globalID, 'ignore@email.com', '00000', identityCard, timestamp);

    reporter.setSignature(MyCrypto.signMsg(reporter.getMsgHash(), MyCrypto.importFromPrivateKey(outPrivKey)));
    console.log(`mcaddress:  ${mcAddress}\nglobalId:  ${globalID}\nidentityCard:  ${identityCard}\ntimestamp:  ${timestamp}\nsignature:  ${reporter.getSignature()}`);

    let obj = { username: reporterName, publicKey: outPubKey, privateKey: outPrivKey };
    writJson2File(getUserCfgPath(reporterName), obj);

}

reporterApply(argvUserName, argvGlobalId, argvIdentityCard);