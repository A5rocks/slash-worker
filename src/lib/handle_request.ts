import { verifySig } from './signatures';
import {
    Interaction,
    InteractionType,
} from 'slash-commands/dist/src/structures';
import { publicKeys, log } from '..';
import { handleCommand } from './handle_command';
import { transformRequest } from './transform_request';

const MAX_AGE = 5; // max age of signature in seconds

export async function handleRequest(evt: FetchEvent): Promise<Response> {
    const request = evt.request;

    // necessary checks
    if (request.method !== 'POST')
        return new Response('Method Not Allowed.', { status: 405 });

    const sig = request.headers.get('X-Signature-Ed25519');

    if (sig === null)
        return new Response('No signature given.', { status: 401 });

    const timestamp = request.headers.get('X-Signature-Timestamp');

    if (timestamp == null)
        return new Response('No timestamp given.', { status: 401 });

    if (parseInt(timestamp) < Date.now() / 1000 - MAX_AGE)
        return new Response('Too old timestamp.', { status: 401 });

    const body = await request.clone().text();
    var correct = false;
    var from = '';

    for (const keyFrom in publicKeys) {
        if (await verifySig(publicKeys[keyFrom], timestamp, body, sig)) {
            correct = true;
            from = keyFrom;
            break;
        }
    }

    if (!correct) return new Response('Invalid signature', { status: 401 });

    // todo: some sort of validation... maybe. Only trusted people can get
    // here, after all.
    const req = (await request.json()) as Interaction;

    if (req === null) return new Response('Invalid request', { status: 400 });

    if (req.type === InteractionType.PING) {
        return new Response(JSON.stringify({ type: 1 }));
    } else if (req.type === InteractionType.APPLICATION_COMMAND) {
        try {
            const result = await handleCommand(
                transformRequest(req, from),
                evt,
            );
            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            log(e, transformRequest(req, from));

            return new Response(
                JSON.stringify({
                    type: 4,
                    data: {
                        content: 'An error occurred, try again in a while.',
                    },
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
    } else {
        return new Response('Unknown `type`!', { status: 400 });
    }
}
