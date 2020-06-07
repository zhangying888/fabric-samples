/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const MyCrypto = require('./cryptoutil');


// Enumerate commercial paper state values
const MaterialState = {
    PUBLIC: "public",
    SECRET: "secret"
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Material extends State {
    constructor(obj) {
        super(Material.getClass(), [obj.globalID, obj.versionCode]);
        Object.assign(this, obj);
    }

    getMsgHash() {
        let characterMsg = [this.globalID, this.versionCode, this.contentHash].join();
        return MyCrypto.hash(characterMsg);
    }

    getSignature() {
        return this.signature;
    }

    setSignature(signature) {
        this.signature = signature;
    }

    // getAuthor() {
    //     return this.creator;
    // }

    // setAuthor(newAddress) {
    //     this.mcAddress = newAddress;
    // }

    getGlobalID() {
        return this.globalID;
    }

    setGlobalID(globalID) {
        this.globalID = globalID;
    }

    getVersionCode() {
        return this.versionCode;
    }

    setVersionCode(versionCode) {
        this.versionCode = versionCode;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    getPublishDate() {
        return this.publishDate;
    }

    setPublishDate(publishDate) {
        this.publishDate = publishDate;
    }

    getContentHash() {
        return this.contentHash;
    }

    setContentHash(contentHash) {
        this.contentHash = contentHash;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    getModifiedDate() {
        return this.modifiedDate;
    }

    setModifiedDate(modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    getSourceName() {
        return this.sourceName;
    }

    setSourceName(sourceName) {
        this.sourceName = sourceName;
    }

    getSourceUrl() {
        return this.sourceUrl;
    }

    setSourceUrl(sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    static fromBuffer(buffer) {
        return Material.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Material);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature) {
        return new Material({ globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature });
    }

    static getClass() {
        return 'org.mediachain.material';
    }
}

module.exports = Material;
