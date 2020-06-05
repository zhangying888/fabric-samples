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
const MyCrypto = require('../contract/lib/cryptoutil.js');

const reporterPublicKey = '04c30eb86b6fc77f5caa349f976a3cdfb7ffb93b55b75281ccdf695f78707e6287ef82e9e8622aa5dd01806743094a495e82cbcb8b0501244e5e213630dcada47d';
const reporterPrivateKey = 'b605a68ecbb47ec1aa4596d66a5583193796b4390f0e819f9f237d7248ff7c9e';


function sleep(s) {
    // eslint-disable-next-line no-undef
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function addReporter(contract) {
    // mcAddress, currentState, globalID, email, phone, identityCard, signature
    let mcAddress = reporterPublicKey;
    let globalID = 'reporter0001';
    let email = 'r0001@mediachain.com';
    let phone = '18812345678';
    let identityCard = '110011199001011234';

    let reporter = Reporter.createInstance(mcAddress, 'active', globalID, email, phone, identityCard);

    reporter.setSignature(MyCrypto.signMsg(reporter.getMsgHash(), MyCrypto.importFromPrivateKey(reporterPrivateKey)));


    // let response = await contract.submitTransaction(
    //     'addReporter', reporter.mcAddress, reporter.currentState, reporter.globalID, reporter.email, reporter.phone, reporter.identityCard, reporter.signature);
    // let retReporter = Reporter.fromBuffer(response);
    let tx = contract.createTransaction('addReporter');
    let response = await tx.submit(reporter.mcAddress, reporter.currentState, reporter.globalID, reporter.email, reporter.phone, reporter.identityCard, reporter.signature);
    let retReporter = Reporter.fromBuffer(response);
    console.log(tx);
    // getTransactionId
    // this.createTransaction(name).submit(...args);
    return retReporter;
}

async function getReporter(contract) {
    let mcAddress = reporterPublicKey;
    let response = await contract.submitTransaction('getReporter', mcAddress);
    return Reporter.fromBuffer(response);
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
    // assert(versionHead.versionCode === respHead.versionCode);
    return respHead;
}

async function addMaterial(contract) {
    // globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature
    let globalID = 'guid-material-0001';
    let versionCode = 1;
    let title = 'some title';
    let publishDate = 'secondnow';
    let fileContentHash = 'bac3090257be280087D8bdc530265203d105b120';
    let status = 'secret';
    let user = reporterPublicKey;
    let modifiedDate = publishDate;
    let sourceName = 'apple.jpg';
    let sourceUrl = 's3.mediachain.org/apple.jpg';
    let signature = 'dummy_signature_by_user';
    let response = await contract.submitTransaction('addMaterial', globalID, versionCode, title, publishDate, fileContentHash, status, user, modifiedDate, sourceName, sourceUrl, signature);
    return Material.fromBuffer(response);
}

async function getMaterial(contract) {
    let globalID = 'guid-material-0001';
    let response = await contract.submitTransaction('getMaterial', globalID);
    let material = Material.fromBuffer(response);
    return material;
}

async function addClue(contract, materials) {
    let globalID = 'guid0001';
    let versionCode = 1;
    let title = 'some title';
    let publishDate = 'secondnow';
    let contentHash = '0xbac3090257be280087D8bdc530265203d105b120';
    let status = 'secret';
    let user = 'reportter0001@mediachain.com';
    let modifiedDate = publishDate;
    // let materials = ['mguid:0001'];
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
    const wallet = await Wallets.newFileSystemWallet('/tmp/test/identity/user/isabella/wallet');

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

        const contract = await network.getContract('mycc');

        await addReporter(contract);
        // sleep(5);

        // let reporter = await getReporter(contract);
        // console.log(`reporter added, mcAddress: ${reporter.mcAddress}`);

        // await addMaterial(contract);
        // sleep(5);
        // let material = await getMaterial(contract);
        // let versionHead = await getVersionHead(contract, VersionHead.createInstance('material', 'guid-material-0001', 1));
        // console.log(versionHead);
        // console.log(material);

        // let refMaterial = [`${material.globalID}:${material.versionCode}`];
        // console.log(refMaterial);
        // await addClue(contract, refMaterial);
        // sleep(2);
        // let clue = await getClue(contract);
        // console.log(clue);
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
