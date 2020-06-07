'use strict';


// Bring key classes into scope, most importantly Fabric SDK network class
const assert = require('assert');
const fs = require('fs');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Editor = require('../contract/lib/editor.js');
const Reporter = require('../contract/lib/reporter.js');
const Clue = require('../contract/lib/clue.js');
const VersionHead = require('../contract/lib/versionhead.js');
const Material = require('../contract/lib/material.js');
const DemoUtil = require('./demoutil.js');
const MyCrypto = require('../contract/lib/cryptoutil.js');


function getUserPrivateKey(username) {
    let cfgPath = `/home/zy/demo/${username}.json`;
    let cfg = fse.readJSONSync(cfgPath);
    return cfg.privateKey;
}

async function userGenSignature(user, destObj) {
    let priv = getUserPrivateKey(user);
    let msg = destObj.getMsgHash();
    return MyCrypto.signMsg(msg, MyCrypto.importFromPrivateKey(priv));
}

async function addEditor(contract, paramObj) {
    // mcAddress, currentState, globalID, email, phone, identityCard, signature
    let mcAddress = paramObj.mcaddress;
    let currentState = 'active';

    let tx = contract.createTransaction('addEditor');
    let response = await tx.submit(mcAddress, currentState);

    console.log(tx);
    let retEditor = Editor.fromBuffer(response);

    return { obj: retEditor, tx: tx };
}

async function addReporter(contract, paramObj) {
    // mcAddress, currentState, globalID, email, phone, identityCard, signature
    //{ mcaddress, globalId, timestamp, identityCard, signature }
    let mcAddress = paramObj.mcaddress;
    let globalID = paramObj.globalId;
    let email = 'dummy@mediachain.com';
    let phone = '18812345678';
    let identityCard = paramObj.identityCard;
    let currentState = 'active';

    let tx = contract.createTransaction('addReporter');
    // mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature
    let response = await tx.submit(mcAddress, currentState, globalID, email, phone, identityCard, paramObj.timestamp, paramObj.signature);

    console.log(tx);
    let retReporter = Reporter.fromBuffer(response);
    return { obj: retReporter, tx: tx };
}

async function addMaterial(contract, paramObj) {
    // addOrUpdate(globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl) {
    let globalID = paramObj.globalId;
    let versionCode = paramObj.versionCode;
    let title = paramObj.title;
    let publishDate = DemoUtil.getDateTime();
    let fileContentHash = paramObj.contentHash;
    let status = 'public';
    let user = paramObj.modified_user;
    let modifiedDate = publishDate;
    let sourceName = paramObj.sourceName;
    let sourceUrl = paramObj.sourceUrl;

    // (globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature)
    let tempMaterial = Material.createInstance(globalID, versionCode, title, publishDate, fileContentHash, status, user, modifiedDate, sourceName, sourceUrl, 'padding');
    let signature = userGenSignature(paramObj.modified_user, tempMaterial);

    let tx = contract.createTransaction('addMaterial');
    let response = await tx.submit(
        globalID, versionCode, title, publishDate, fileContentHash, status, user, modifiedDate, sourceName, sourceUrl, signature);
    console.log(tx);
    let retMaterial = Material.fromBuffer(response);
    return { obj: retMaterial, tx: tx };
}

async function addClue(contract, paramObj) {
    // globalId, versionCode, title, --publishDate--, contentHash, --status--, user, , signature
    console.log(paramObj);

    let globalID = paramObj.globalId;
    let versionCode = paramObj.versionCode;
    let title = paramObj.title;
    let publishDate = DemoUtil.getDateTime();
    let contentHash = paramObj.contentHash;
    let status = 'public';
    let user = paramObj.user;
    let modifiedDate = publishDate;
    let sourceUrl = paramObj.sourceUrl;

    // globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature
    let tempClue = Clue.createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, 'padding');

    let signature = userGenSignature(paramObj.user, tempClue);

    console.log({ globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature });

    let tx = contract.createTransaction('addClue');
    let response = await tx.submit(
        globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature);
    console.log(tx);
    let retClue = Clue.fromBuffer(response);
    return { obj: retClue, tx: tx };
}


function fnByOpName(opName) {
    switch (opName) {
        case 'addEditor': return addEditor;
        case 'addReporter': return addReporter;
        case 'addMaterial': return addMaterial;
        case 'addClue': return addClue;
    }
}


async function upload2ChainAsync(opName, paramObj) {
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
        console.log('Use org.mediachain smart contract.');

        const contract = await network.getContract('mycc');
        let context = this;
        let fn = fnByOpName(opName);
        let ret = await fn.call(context, contract, paramObj);

        if (fse.existsSync('/home/zy/demo/dummyRpcResult.json')) {
            fse.removeSync('/home/zy/demo/dummyRpcResult.json');
            fse.createFileSync('/home/zy/demo/dummyRpcResult.json');
        }
        fse.writeJSONSync(
            '/home/zy/demo/dummyRpcResult.json',
            { txid: ret.tx.getTransactionId() });
    } catch (error) {
        console.log(`Error processing transaction.${error} `);
        console.log(error.stack);
    }
    finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

function upload2chain(opName, paramObj) {
    upload2ChainAsync(opName, paramObj).then(() => {
        console.log('Issue program complete.');

    }).catch((e) => {

        console.log('Issue program exception.');
        console.log(e);
        console.log(e.stack);
        process.exit(-1);

    });
}

/*
所有的都有三步，１．接收cms的参数
              2.上链操作
              3.返回txid
*/

module.exports = {
    upload2chain
};