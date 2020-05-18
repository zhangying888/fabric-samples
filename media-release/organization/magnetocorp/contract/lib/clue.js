/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const ClueState = {
    PUBLIC: "public",
    SECRET: "secret"
};

class Clue extends State {
    /*
  `SetPublishDate` varchar(255) DEFAULT NULL,
  `Category` int(11) DEFAULT NULL,
  `ChannelCode` varchar(255) DEFAULT NULL,
  `User` int(11) DEFAULT NULL,
  `TotalPage` int(11) DEFAULT '1',
  `OrderNumber` bigint(20) unsigned DEFAULT '0',
  `Status` int(11) DEFAULT NULL,
  `Active` tinyint(4) DEFAULT NULL,
  `IsPhotoNews` tinyint(4) DEFAULT NULL,
  `DocTop` int(11) DEFAULT '0',
  `DocTopTime` int(11) DEFAULT '0',
  `Random` int(11) DEFAULT NULL,
  `Weight` int(11) DEFAULT NULL,
  `CreateDate` int(11) unsigned DEFAULT '0',
  `ModifiedDate` int(11) unsigned DEFAULT '0',
  `GenerateFileDate` int(11) unsigned DEFAULT '0',
  `Photo` varchar(250) DEFAULT NULL,
  `ModifiedUser` int(11) DEFAULT NULL,
  `IsDoption` int(11) DEFAULT '0',
  `Province` int(11) DEFAULT '0',
  `City` int(11) DEFAULT '0',
  `County` int(11) DEFAULT '0',
  `ClueForm` varchar(250) DEFAULT '0',
  `ClueArea` int(11) DEFAULT '0',
  `UserId` int(11) DEFAULT '0',
  `Company` int(11) DEFAULT '0',
  `Longitude` double DEFAULT '0',
  `Latitude` double DEFAULT NULL,
  `ConfirmCount` int(11) DEFAULT NULL,
  `ProvinceName` varchar(250) DEFAULT NULL,
  `CityName` varchar(250) DEFAULT NULL,
  `CountryName` varchar(250) DEFAULT NULL,
  `ClueType` int(11) DEFAULT NULL,
  `ClueAreaName` varchar(250) DEFAULT NULL,
  `NewsLinkCount` int(11) DEFAULT '0',
  `Score` int(11) DEFAULT '0',
  `GroupConfirmCount` int(11) DEFAULT '0',
     */
    constructor(obj) {
        super(Clue.getClass(), [obj.globalID, obj.versionCode]);
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

    getMaterials() {
        return this.materials;
    }

    setMaterials(materials) {
        this.materials = materials;
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
    static createInstance(globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature) {
        return new Clue({ globalID, versionCode, title, publishDate, contentHash, status, user, modifiedDate, materials, signature });
    }

    static getClass() {
        return 'org.mediachain.clue';
    }
}

module.exports = Clue;
