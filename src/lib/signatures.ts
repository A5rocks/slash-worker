export async function verifySig(
    key: string,
    timestamp: string,
    body: string,
    sig: string,
): Promise<boolean> {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(key, 'hex'),
        { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' },
        false,
        ['verify'],
    );

    return await crypto.subtle.verify(
        'NODE-ED25519',
        cryptoKey,
        Buffer.from(sig, 'hex'),
        Buffer.from(timestamp + body),
    );
}
