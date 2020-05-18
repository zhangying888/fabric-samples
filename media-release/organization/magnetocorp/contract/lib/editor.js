/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const EditorState = {
    ACTIVE: "active",
    DEPRECATED: "deprecated"
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Editor extends State {

    constructor(obj) {
        super(Editor.getClass(), [obj.mcAddress]);
        Object.assign(this, obj);
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

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setActive() {
        this.currentState = EditorState.ACTIVE;
    }

    setDeprecated() {
        this.currentState = EditorState.DEPRECATED;
    }

    isActive() {
        return this.currentState == EditorState.ACTIVE;
    }

    isDeprecated() {
        return this.currentState == EditorState.DEPRECATED;
    }

    static fromBuffer(buffer) {
        return Editor.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Editor);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(mcAddress, currentState) {
        return new Editor({ mcAddress, currentState });
    }

    static getClass() {
        return 'org.mediachain.editor';
    }
}

module.exports = Editor;
