/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

const ResourceType = {
    CLUE: "clue",
    MATERIAL: "material",
    TASK: "task"
};


class VersionHead extends State {

    constructor(obj) {
        super(VersionHead.getClass(), [obj.type, obj.guid]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getGuid() {
        return this.guid;
    }

    setGuid(guid) {
        this.guid = guid;
    }

    getHead() {
        return this.head;
    }

    setHead(head) {
        this.head = head;
    }

    static fromBuffer(buffer) {
        return VersionHead.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, VersionHead);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(type, guid, head) {
        return new VersionHead({ type, guid, head });
    }

    static getClass() {
        return 'org.mediachain.versionhead';
    }
}

module.exports = VersionHead;
