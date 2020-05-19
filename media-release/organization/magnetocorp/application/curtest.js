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
async function main() {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('/tmp/identity/user/isabella/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'isabella';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract');


        // --------------------------------------------------------------------------------------------

        // let clue = await addClue(contract);
        // sleep(5);
        // let retClue = await getClue(contract);
        // assert(clue.globalID === retClue.globalID);
        // assert(clue.contentHash === retClue.contentHash);

        let originMaterial = await addMaterial(contract);
        sleep(5);
        let retMaterial = await getMaterial(contract);
        assert(originMaterial.globalID === retMaterial.globalID);
        assert(originMaterial.contentHash === retMaterial.contentHash);

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
