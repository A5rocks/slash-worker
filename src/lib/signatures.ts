// tracking:
// https://community.cloudflare.com/t/webcrypto-support-for-ed25519/228897
// the ed25519 impl here takes ~40ms, which is over the worker limit... even
// though cloudflare has not stopped the worker, I don't want to push it.
import { check } from './wasm_ed25519';

// WASM_MODULE is provided by wrangler / webpack
// @ts-expect-error
const mod = WASM_MODULE;

let wasm: WebAssembly.Instance;

export function verifySig(
    key: string,
    timestamp: string,
    body: string,
    sig: string,
) {
    if (!wasm) {
        wasm = new WebAssembly.Instance(mod, undefined);
    }

    return check(wasm.exports, key, sig, timestamp + body);
}
