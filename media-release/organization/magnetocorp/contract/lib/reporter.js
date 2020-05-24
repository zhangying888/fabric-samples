/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const MyCrypto = require('./cryptoutil');

// Enumerate commercial paper state values
const ReporterState = {
    ACTIVE: "active",
    DEPRECATED: "deprecated"
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Reporter extends State {
    /*
      `GlobalID` int(11) DEFAULT NULL,
      `Email` varchar(250) DEFAULT NULL,
      `Phone` varchar(250) DEFAULT NULL,
      `IdentityCard` varchar(250) DEFAULT NULL,
     */
    constructor(obj) {
        super(Reporter.getClass(), [obj.mcAddress]);
        Object.assign(this, obj);
    }

    getMsgHash() {
        let content4Hash = [this.mcAddress, this.globalID, this.timestamp, this.identityCard].join();
        return MyCrypto.hash(content4Hash);
    }

    getSignature() {
        return this.signature;
    }

    setSignature(signature) {
        this.signature = signature;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    getTimestamp() {
        return this.timestamp;
    }

    /**
     * Basic getters and setters
    */
    getMCAddress() {
        return this.mcAddress;
    }

    setMCAddress(newAddress) {
        this.mcAddress = newAddress;
    }

    getGlobalID() {
        return this.globalID;
    }

    setGlobalID(globalID) {
        this.globalID = globalID;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getIdentityCard() {
        return this.identityCard;
    }

    setIdentityCard(identityCard) {
        this.identityCard = identityCard;
    }



    /**
     * Useful methods to encapsulate commercial paper states
     */
    setActive() {
        this.currentState = ReporterState.ACTIVE;
    }

    setDeprecated() {
        this.currentState = ReporterState.DEPRECATED;
    }

    isActive() {
        return this.currentState == ReporterState.ACTIVE;
    }

    isDeprecated() {
        return this.currentState == ReporterState.DEPRECATED;
    }

    static fromBuffer(buffer) {
        return Reporter.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Reporter);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature) {
        return new Reporter({ mcAddress, currentState, globalID, email, phone, identityCard, timestamp, signature });
    }

    static getClass() {
        return 'org.mediachain.reporter';
    }
}

module.exports = Reporter;
