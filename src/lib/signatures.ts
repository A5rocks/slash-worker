// tracking:
// https://community.cloudflare.com/t/webcrypto-support-for-ed25519/228897
// the ed25519 impl here takes ~40ms, which is over the worker limit... even
// though cloudflare has not stopped the worker, I don't want to push it.
import { encode as utfencode } from '@stablelib/utf8';
import { verify } from '@stablelib/ed25519';
import { decode as hexdecode } from '@stablelib/hex';

export function verifySig(
    key: string,
    timestamp: string,
    body: string,
    sig: string,
) {
    return verify(hexdecode(key), utfencode(timestamp + body), hexdecode(sig));
}
