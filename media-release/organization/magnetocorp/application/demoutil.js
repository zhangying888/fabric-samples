/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const moment = require('moment');

class DemoUtil {
    static getDateTime() {
        return moment().format('YYYY-MM-DD:HH:MM:SS');
    }
}

module.exports = DemoUtil;
