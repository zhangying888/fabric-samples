'use strict';

const argv = require('yargs');
const fnRegister = require('./register.js');
const fnAddOrUpdate = require('./imageop.js');
const { ucEditorIdentity } = require('./mediachainops.js');

argv.wrap(argv.terminalWidth())
    .usage('Usage: $0 <command> [options]')
    .command('genRegisterReporter', 'reporter register',
        function (yargs) {
            // login command options
            return yargs.option('username').option('globalId').option('identityCard');
        },
        function ({ role, username, globalId, identityCard }) {
            fnRegister('reporter', username, globalId, identityCard);
        }
    ).usage('node democli.js genRegisterReporter --username yueyunpeng --globalId reporter0001 --identityCard 210011198806061234')
    .command('genRegisterEditor', 'Editor register',
        function (yargs) {
            // login command options
            return yargs.option('username').option('globalId').option('identityCard');
        },
        function ({ role, username, globalId, identityCard }) {
            fnRegister('editor', username, globalId, identityCard);
        }
    ).usage('node democli.js addOrUpdateImage --username guodegang --globalId editor0001 --identityCard 110011198806061234')
    .command('addOrUpdateImage', 'add or update image',
        function (yargs) {
            // globalID, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl
            return yargs.option('globalId').option('versionCode').option('title').option('contentHash').option('user').option('modified_user').option('sourceName').option('sourceUrl');
        },
        function ({ globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl }) {
            return fnAddOrUpdate(globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl);
        }
    ).usage('node democli.js ucEditorIdentity --mcaddress xxx')
    .command('ucEditorIdentity', 'add editor identity to chain',
        function (yargs) {
            // globalID, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl
            return yargs.option('mcaddress');
        },
        function ({ mcaddress }) {
            return ucEditorIdentity(mcaddress);
        }
    )
    .argv;

// node democli.js genRegisterReporter --username guodegang --globalId editor0001 --identityCard 110011198806061234