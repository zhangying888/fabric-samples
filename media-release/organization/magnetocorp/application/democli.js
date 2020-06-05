'use strict';

const argv = require('yargs');
const fnRegister = require('./register.js');
const fnAddOrUpdate = require('./imageop.js');
const {
    upload2chain
} = require('./mediachainops.js');

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
    ).usage('democli genRegisterReporter --username yueyunpeng --globalId reporter0001 --identityCard 210011198806061234')
    .command('genRegisterEditor', 'Editor register',
        function (yargs) {
            // login command options
            return yargs.option('username').option('globalId').option('identityCard');
        },
        function ({ role, username, globalId, identityCard }) {
            fnRegister('editor', username, globalId, identityCard);
        }
    ).usage('democli addOrUpdateImage --username guodegang --globalId editor0001 --identityCard 110011198806061234')
    .command('addOrUpdateImage', 'add or update image',
        function (yargs) {
            // globalID, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl
            return yargs.option('globalId').option('versionCode').option('title').option('contentHash').option('user').option('modified_user').option('sourceName').option('sourceUrl');
        },
        function ({ globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl }) {
            return fnAddOrUpdate(globalId, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl);
        }
    ).usage('democli addEditor --mcaddress xxx')
    .command('addEditor', 'add editor identity to chain',
        function (yargs) {
            // globalID, versionCode, title, contentHash, user, modified_user, sourceName, sourceUrl
            return yargs.option('mcaddress');
        },
        function ({ mcaddress }) {
            // upload2chain(action, paramObj)
            return upload2chain('addEditor', { mcaddress });
        }
    )
    // .usage('node democli.js u2cEditorIdentity --mcaddress xxx')
    // .command('u2cReporterIdentity', 'add editor identity to chain',
    //     function (yargs) {
    //         // mcaddress, reporterName, globalId, identityCard, timestamp, signature
    //         // this.mcAddress, this.globalID, this.timestamp, this.identityCard
    //         return yargs.option('mcaddress').option('globalId').option('timestamp').option('identityCard').option('signature');
    //     },
    //     function ({ mcaddress, globalId, timestamp, identityCard, signature }) {
    //         return u2cReporterIdentity(mcaddress, globalId, timestamp, identityCard, signature);
    //     }
    // )
    .argv;

// mcaddress, reporterName, globalID, identityCard, timestamp, signature
// node democli.js genRegisterReporter --username guodegang --globalId editor0001 --identityCard 110011198806061234
// 类似于模板一样去实现，根本上这里需要什么
// node democli.js 