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
const MyCrypto = require('./cryptoutil.js');

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

    async getEditor(ctx, mcAddress) {

        // Retrieve the current paper using key fields provided
        let paperKey = Editor.makeKey([mcAddress]);
        let paper = await ctx.stateAgent.get(paperKey);
        return paper;
    }

    async addReporter(ctx, mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature) {
        // mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature
        let reporter = Reporter.createInstance(mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature);
        if (!MyCrypto.verifySig(signature, reporter.getMsgHash(), mcAddress)) {
            throw new Error('invalid signature for addReporter');
        }
        // TODO: verify user signature
        await ctx.stateAgent.add(reporter);
        return reporter;
    }

    async getReporter(ctx, mcAddress) {
        let reporterKey = Reporter.makeKey([mcAddress]);
        let reporter = await ctx.stateAgent.get(reporterKey);
        return reporter;
    }

    async addVersionHead(ctx, type, globalID, versionCode) {
        let head = VersionHead.createInstance(type, globalID, versionCode)
        await ctx.stateAgent.add(head);
        return head;
    }

    async getVersionHead(ctx, type, globalID) {
        let response = await ctx.stateAgent.get(VersionHead.makeKey([type, globalID]));
        return response;
    }


    async addMaterial(ctx, globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature) {
        let versionHead = VersionHead.createInstance('material', globalID, versionCode);
        await ctx.stateAgent.add(versionHead);

        let material = Material.createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature);
        await ctx.stateAgent.add(material);
        return material;
    }

    async getMaterial(ctx, globalID) {
        let materialHeadKey = VersionHead.getMaterialKey(globalID);
        let versionHead = await ctx.stateAgent.get(materialHeadKey);
        if (versionHead == null) {
            return null;
        }
        return await this.getMaterialByVersionCode(ctx, globalID, versionHead.versionCode);
    }

    async getMaterialByVersionCode(ctx, globalID, versionCode) {
        let key = Material.makeKey([globalID, versionCode]);
        return await ctx.stateAgent.get(key);
    }

    /*
    materials: materials array, every material represent by a [material_global_id:version_code]
    */
    async addClue(ctx, globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature) {
        //version code key 不能已经存在        
        // let clueKey = VersionHead.getClueKey(globalID);
        // let nilClue = await ctx.stateAgent.get(clueKey);
        // if (nilClue != null) {
        //     throw new Error(`add clue failed, ${clueKey} exist`);
        // }
        // // VersionCode 应该只能是1  
        // if (versionCode != 1) {
        //     throw new Error('version code should start at 1');
        // }
        let versionHead = VersionHead.createInstance('clue', globalID, versionCode);
        await ctx.stateAgent.add(versionHead);
        // check material exist
        let clue = Clue.createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature);
        await ctx.stateAgent.add(clue);
        return clue;
    }

    async updateClue(ctx, globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature) {
        let clueKey = VersionHead.getClueKey(globalID);
        let oldVersionHead = await ctx.stateAgent.get(clueKey);
        if (oldVersionHead.versionCode != versionCode + 1) {
            throw new Error('invalid version code');
        }

        let clue = Clue.createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature);
        await ctx.stateAgent.update(clue);
        return clue;
    }

    async getClue(ctx, globalID) {
        let clueHeadKey = VersionHead.getClueKey(globalID);
        let versionHead = await ctx.stateAgent.get(clueHeadKey);
        if (versionHead == null) {
            return null;
        }

        return await this.getClueByVersionCode(ctx, globalID, versionHead.versionCode);
    }

    async getClueByVersionCode(ctx, globalID, versionCode) {
        let key = Clue.makeKey([globalID, versionCode]);
        return await ctx.stateAgent.get(key);
    }
}

module.exports = MediaReleaseContract;
