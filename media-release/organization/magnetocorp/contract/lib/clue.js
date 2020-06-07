/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const MyCrypto = require('./cryptoutil');

// Enumerate commercial paper state values
const ClueState = {
    PUBLIC: "public",
    SECRET: "secret"
};

class Clue extends State {
    constructor(obj) {
        super(Clue.getClass(), [obj.globalID, obj.versionCode]);
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

    getSourceUrl() {
        return this.getSourceUrl;
    }

    setSourceUrl(src) {
        this.sourceUrl = src;
    }

    static fromBuffer(buffer) {
        return Clue.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Clue);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature) {
        return new Clue({ globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceUrl, signature });
    }

    static getClass() {
        return 'org.mediachain.clue';
    }
}

module.exports = Clue;
