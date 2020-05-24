/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const moment = require('moment');

class DemoUtil {
    static getDateTime() {
        moment().format('yyyy-mm-dd:hh:mm:ss');
    }
}

module.exports = DemoUtil;
