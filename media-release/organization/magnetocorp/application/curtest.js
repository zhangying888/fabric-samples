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
const assert = require('assert');
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Editor = require('../contract/lib/editor.js');
const Reporter = require('../contract/lib/reporter.js');
const Clue = require('../contract/lib/clue.js');
const VersionHead = require('../contract/lib/versionhead.js');
const Material = require('../contract/lib/material.js');

function sleep(s) {
    // eslint-disable-next-line no-undef
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function addVersionHead(contract) {
    let globalID = 'guid10086';
    let versionCode = 1;
    let response = await contract.submitTransaction('addVersionHead', 'clue', globalID, versionCode);
    let versionHead = VersionHead.fromBuffer(response);
    console.log(`addVersionHead response ${response}`);
    return versionHead;
}

async function getVersionHead(contract, versionHead) {
    let response = await contract.submitTransaction('getVersionHead', versionHead.type, versionHead.globalID);
    let respHead = VersionHead.fromBuffer(response);
    assert(versionHead.versionCode === respHead.versionCode);
    return respHead;
}

async function addMaterial(contract) {
    // globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature
    let globalID = 'guid-material-0001';
    let versionCode = 1;
    let title = 'some title';
    let publishDate = 'secondnow';
    let contentHash = '0xbac3090257be280087D8bdc530265203d105b120';
    let status = 'secret';
    let user = 'reportter0001@mediachain.com';
    let modifiedDate = publishDate;
    let sourceName = 'apple.jpg';
    let sourceUrl = 's3.mediachain.org/apple.jpg';
    let signature = 'dummy_signature_by_user';
    let response = await contract.submitTransaction('addMaterial', globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature);
    return Material.fromBuffer(response);
}

async function getMaterial(contract) {
    let globalID = 'guid-material-0001';
    let response = await contract.submitTransaction('getMaterial', globalID);
    console.log(response);
    let material = Material.fromBuffer(response);
    return material;
}

async function addClue(contract) {
    let globalID = 'guid0001';
    let versionCode = 1;
    let title = 'some title';
    let publishDate = 'secondnow';
    let contentHash = '0xbac3090257be280087D8bdc530265203d105b120';
    let status = 'secret';
    let user = 'reportter0001@mediachain.com';
    let modifiedDate = publishDate;
    let materials = ['mguid:0001'];
    let signature = 'dummy_signature_by_user';
    let response = await contract.submitTransaction('addClue', globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature);
    return Clue.fromBuffer(response);
}

async function getClue(contract) {
    let globalID = 'guid0001';
    let response = await contract.submitTransaction('getClue', globalID);
    console.log(response);
    let clue = Clue.fromBuffer(response);
    return clue;
}

// Main program function
async function ucEditorIdentity_local(mcaddress) {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('/tmp/identity/user/isabella/wallet');
    console.log('dummy call ucEditorIdentity_local ');

}

function ucEditorIdentity(mcaddress) {
    ucEditorIdentity_local(mcaddress).then(() => {
        console.log('Issue program complete.');

    }).catch((e) => {

        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        process.exit(-1);

    });
}

module.exports = { ucEditorIdentity };