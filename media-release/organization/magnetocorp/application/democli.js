'use strict';

const argv = require('yargs');
const fnRegister = require('./register.js');

argv.usage('Usage: $0 <command> [options]')
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
            fnRegister('reporter', username, globalId, identityCard);
        }
    ).usage('node democli.js genRegisterEditor --username guodegang --globalId editor0001 --identityCard 110011198806061234')
    .argv;

// node democli.js genRegisterReporter --username guodegang --globalId editor0001 --identityCard 110011198806061234