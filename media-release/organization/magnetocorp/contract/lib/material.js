/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

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
    /*
  `PublishDate` int(11) unsigned DEFAULT '0',
  `ContentHash`,
  `User` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `IsPhotoNews` tinyint(4) DEFAULT NULL,
  `CreateDate` int(11) unsigned DEFAULT '0',
  `ModifiedDate` int(11) unsigned DEFAULT '0',
  `GenerateFileDate` int(11) unsigned DEFAULT '0',
  `Photo` varchar(250) DEFAULT NULL,
  `ModifiedUser` int(11) DEFAULT NULL,
  `SourceName` varchar(250) DEFAULT NULL,
  `UserId` int(11) DEFAULT '0',
  `SourceUrl` varchar(250) DEFAULT NULL,
  `ClueGid` int(11) DEFAULT '0',
  `ClueGroupid` int(11) DEFAULT '0',
     */
    constructor(obj) {
        super(Material.getClass(), [obj.globalID, obj.versionCode]);
        Object.assign(this, obj);
    }

    getMsgHash() {

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
        return status;
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
        return new Reporter({ globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, sourceName, sourceUrl, signature });
    }

    static getClass() {
        return 'org.mediachain.material';
    }
}

module.exports = Material;
