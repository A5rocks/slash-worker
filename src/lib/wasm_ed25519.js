// this is taken from wasm bindgen's output

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0(wasm) {
    if (
        cachegetUint8Memory0 === null ||
        cachegetUint8Memory0.buffer !== wasm.memory.buffer
    ) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

const lTextEncoder =
    typeof TextEncoder === 'undefined'
        ? (0, module.require)('util').TextEncoder
        : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString =
    typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
              return cachedTextEncoder.encodeInto(arg, view);
          }
        : function (arg, view) {
              const buf = cachedTextEncoder.encode(arg);
              view.set(buf);
              return {
                  read: arg.length,
                  written: buf.length,
              };
          };

function passStringToWasm0(wasm, arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0(wasm)
            .subarray(ptr, ptr + buf.length)
            .set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0(wasm);

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7f) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, (len = offset + arg.length * 3));
        const view = getUint8Memory0(wasm).subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 * @param {string} key
 * @param {string} signature
 * @param {string} message
 * @returns {boolean}
 */
export function check(wasm, key, signature, message) {
    var ptr0 = passStringToWasm0(
        wasm,
        key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
    );
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(
        wasm,
        signature,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
    );
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(
        wasm,
        message,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
    );
    var len2 = WASM_VECTOR_LEN;
    var ret = wasm.check(ptr0, len0, ptr1, len1, ptr2, len2);
    return ret !== 0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0(wasm) {
    if (
        cachegetInt32Memory0 === null ||
        cachegetInt32Memory0.buffer !== wasm.memory.buffer
    ) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

const lTextDecoder =
    typeof TextDecoder === 'undefined'
        ? (0, module.require)('util').TextDecoder
        : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', {
    ignoreBOM: true,
    fatal: true,
});

cachedTextDecoder.decode();

function getStringFromWasm0(wasm, ptr, len) {
    return cachedTextDecoder.decode(
        getUint8Memory0(wasm).subarray(ptr, ptr + len),
    );
}
/**
 * @returns {string}
 */
export function greet() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.greet(retptr);
        var r0 = getInt32Memory0(wasm)[retptr / 4 + 0];
        var r1 = getInt32Memory0(wasm)[retptr / 4 + 1];
        return getStringFromWasm0(wasm, r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}
