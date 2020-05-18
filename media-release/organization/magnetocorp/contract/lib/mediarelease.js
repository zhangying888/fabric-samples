/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Editor = require('./editor.js');
const Reporter = require('./reporter.js');
const StateAgent = require('./stateagent.js');
const Clue = require('./clue.js');
const Material = require('./material.js');
const VersionHead = require('./versionhead.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class MediaReleaseContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.stateAgent = new StateAgent(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class MediaReleaseContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.mediachain.mediarelease');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new MediaReleaseContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async addEditor(ctx, mcAddress, currentState) {

        // create an instance of the paper
        let paper = Editor.createInstance(mcAddress, currentState);

        await ctx.stateAgent.add(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }

    /**
     * Buy commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} price price paid for this paper
     * @param {String} purchaseDateTime time paper was purchased (i.e. traded)
    */
    async getEditor(ctx, mcAddress) {

        // Retrieve the current paper using key fields provided
        let paperKey = Editor.makeKey([mcAddress]);
        let paper = await ctx.stateAgent.get(paperKey);
        return paper;
    }

    async addReporter(ctx, mcAddress, currentState, globalID, email, phone, identityCard, signature) {
        // mcAddress, currentState, globalID, email, phone, identityCard, signature
        let reporter = Reporter.createInstance(mcAddress, currentState, globalID, email, phone, identityCard, signature);
        // TODO: verify user signature
        await ctx.stateAgent.add(reporter);
        return reporter;
    }

    async getReporter(ctx, mcAddress) {
        let reporterKey = Reporter.makeKey([mcAddress]);
        let reporter = await ctx.stateAgent.get(reporterKey);
        return reporter;
    }

    /*
    materials: materials array, every material represent by a [material_global_id:version_code]
    */
    async addClue(ctx, globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature) {
        //version code key 不能已经存在        
        // let versionHead = VersionHead.
        // VersionCode 应该只能是1        
        let clue = Clue.createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature);
        await ctx.stateAgent.add(clue);
        return clue;
    }
}

module.exports = MediaReleaseContract;
