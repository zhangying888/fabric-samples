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

async function addEditor(contract, paramObj) {
    // mcAddress, currentState, globalID, email, phone, identityCard, signature
    let mcAddress = paramObj.mcaddress;
    let currentState = 'active';

    let tx = contract.createTransaction('addEditor');
    let response = await tx.submit(mcAddress, currentState);

    console.log(tx);
    let retEditor = Editor.fromBuffer(response);

    return retEditor;
}


function fnByOpName(opName) {
    switch (opName) {
        case 'addEditor': return addEditor;
        case '': return undefined;
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
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('mycc');
        let context = this;
        let fn = fnByOpName(opName);
        await fn.call(context, contract, paramObj);
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
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