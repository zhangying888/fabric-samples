/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateManager = require('./../ledger-api/statemanager.js');

const Editor = require('./editor.js');

class StateAgent extends StateManager {

    constructor(ctx) {
        super(ctx, 'org.mediachain.statemanager');
        this.use(Editor);
    }

    async add(editor) {
        return this.addState(editor);
    }

    async get(editorKey) {
        return this.getState(editorKey);
    }

    async update(editor) {
        return this.updateState(editor);
    }
}


module.exports = StateAgent;