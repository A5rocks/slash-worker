import { Interaction } from 'slash-commands/structures/Interaction';
import { InteractionType } from 'slash-commands/structures/InteractionType';
import { encode as utfencode } from '@stablelib/utf8';
import { verify } from '@stablelib/ed25519';
import { decode as hexdecode } from '@stablelib/hex';

// @ts-ignore
const publicKey: string = PUBLIC_KEY;

async function handleOwO(request: any): Promise<Response> {
    return new Response(
        JSON.stringify({
            type: 3,
            data: {
                content:
                    '<:slash:782701715479724063> Did I just hear someone... OwO??? Nice!',
                flags: 64, // ephemeral
            },
        }),
    );
}

async function handleRequest(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed.', {
            status: 405,
        });
    }
    const sig = request.headers.get('X-Signature-Ed25519');

    if (sig === null) {
        return new Response('No signature given.', {
            status: 401,
        });
    }

    const timestamp = request.headers.get('X-Signature-Timestamp');

    if (timestamp == null) {
        return new Response('No timestamp given.', {
            status: 401,
        });
    }

    if (parseInt(timestamp) < Date.now() / 1000 - 5) {
        return new Response('Too old timestamp.', {
            status: 401,
        });
    }

    const body = await request.clone().text();

    const correct = verify(
        hexdecode(publicKey),
        utfencode(timestamp + body),
        hexdecode(sig),
    );

    if (correct === false) {
        return new Response('Invalid signature', {
            status: 401,
        });
    }

    // TODO: some sort of validation... Maybe. Only Discord can get here, after all.
    // See the train wreck of `./parsing.ts`
    const req = (await request.json()) as Interaction;

    if (req === null) {
        return new Response('Invalid request', {
            status: 400,
        });
    }

    if (req.type === InteractionType.PING) {
        return new Response(
            JSON.stringify({
                type: 1,
            }),
        );
    } else if (req.type === InteractionType.APPLICATION_COMMAND) {
        // req.data is guaranteed
        if (!req.data) {
            return new Response('Invalid payload', {
                status: 400,
            });
        }

        if (req.data.id === '786838810297630740') {
            return handleOwO(req);
        } else {
            return new Response(
                JSON.stringify({
                    type: 4,
                    data: {
                        content: 'Command not set up in `slash-worker`!',
                    },
                }),
            );
        }
    } else {
        return new Response('Unknown `type`!');
    }
}

addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});
