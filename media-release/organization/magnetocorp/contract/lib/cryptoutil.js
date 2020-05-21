'use strict';

const crypto = require('crypto');
const elliptic = require('elliptic');

const EC = elliptic.ec;

const ecdsa = new EC(elliptic.curves.p256);

class MyCrypto {
    static generateEcdsaFullKey() {
        let ecdsaKey = ecdsa.genKeyPair();
        console.log(`public key:\n ${ecdsaKey.getPublic().encode('hex')}`);
        console.log(`private key:\n ${ecdsaKey.getPrivate().toString('hex')}`);
        return ecdsaKey;
    }

    static hash(message) {
        const hash1 = crypto.createHash('sha256');
        hash1.update(message);
        return hash1.digest('hex');
    }

    static importFromPrivateKey(privString) {
        // let ecdsa = new EC(elliptic.curves.p256);
        return ecdsa.keyFromPrivate(privString, 'hex');
    }

    static importFromPublicKey(pubString) {
        return ecdsa.keyFromPublic(pubString, 'hex');
    }

    static signMsg(msg, key) {
        return elliptic.utils.toHex(ecdsa.sign(msg, key).toDER());
    }
}

module.exports = MyCrypto;