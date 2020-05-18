/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateManager = require('./../ledger-api/statemanager.js');

const Editor = require('./editor.js');
const Reporter = require('./reporter.js');
const VersionHead = require('./versionhead.js');
const Clue = require('./clue.js');
const Material = require('./material.js');

class StateAgent extends StateManager {

    constructor(ctx) {
        super(ctx, 'org.mediachain.statemanager');
        this.use(Editor);
        this.use(Reporter);
        this.use(VersionHead);
        this.use(Clue);
        this.use(Material);
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