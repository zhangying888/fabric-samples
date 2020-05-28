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

// globalID versionCode title publishDate contentHash user modified_user sourceName sourceUrl signature
function addOrUpdate(globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl) {
    let obj = null;
    let path = `/home/zy/demo/image${globalId}.json`;
    console.log('path is:' + path);
    console.log('globalID is:' + globalId);
    try {
        obj = fse.readJSONSync(path);
    } catch (error) {
        obj = {};
    }
    let strVcode = '' + versionCode;
    // TODO:mediachainJS:  在这里生成签名
    let publishDate = demoutil.getDateTime();
    if (!(strVcode in obj)) {
        obj[strVcode] = { globalId: globalId, versionCode: versionCode, title: title, publishDate: publishDate, contentHash: contentHash, user: user, modified_user: modified_user, sourceName: sourceName, sourceUrl: sourceUrl, signature: 'dummy' };
    }
    fse.writeJSONSync(path, obj);
}

module.exports = addOrUpdate;