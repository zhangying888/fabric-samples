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

function sleep(s) {
    // eslint-disable-next-line no-undef
    return new Promise(resolve => setTimeout(resolve, s * 1000));
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

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');

        const issueResponse = await contract.submitTransaction('addEditor', 'MagnetoCorp', 'active');

        sleep(2);
        // const issueResponse = await contract.submitTransaction('getEditor', 'MagnetoCorp');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        let paper = Editor.fromBuffer(issueResponse);

        console.log(`Editor : ${paper.mcAddress} successfully issued for value ${paper.currentState}`);
        console.log('Transaction complete.');

        // mcAddress, currentState, globalID, email, phone, identityCard, signature
        const addReporterResponse = await contract.submitTransaction('addReporter',
            'reporter0001Address', 'active', 'companyDBId0001', 'reporter0001@mediachain.com', '13888888888', '100000199001019999', '0xaac3090257be280087D8bdc530265203d105b120');
        let reqReporter = Reporter.fromBuffer(addReporterResponse);
        sleep(10);
        const getReportResponse = await contract.submitTransaction('getReporter', 'reporter0001Address');
        let reporter0001 = Reporter.fromBuffer(getReportResponse);
        assert(reqReporter.identityCard === reporter0001.identityCard);

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
