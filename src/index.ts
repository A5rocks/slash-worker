import { Interaction } from 'slash-commands/structures/Interaction';
import { InteractionType } from 'slash-commands/structures/InteractionType';
import { InteractionResponse as TrueInteractionResponse } from 'slash-commands/structures/InteractionResponse';
import { encode as utfencode } from '@stablelib/utf8';
import { verify } from '@stablelib/ed25519';
import { decode as hexdecode } from '@stablelib/hex';
import { Embed } from 'slash-commands/structures/Embed';
import { publicKeys } from './public_keys';

// todo: inheritance, not composition
type InteractionRequest = {
    from: string;
    interaction: Interaction;
};

enum InteractionResponseType {
    // yes I know that this doesn't actually not send anything.
    None = 0,
    SendMessage = 1,

    // yes I know that you can still send a message with just this.
    DisplaySource = 2,
}

// fixme: temp solution as I fix types
type Message = {
    content: string;
    embeds?: Embed[];
    flags?: number;
};

type InteractionResponse = {
    type: InteractionResponseType;
    data?: Message;
};

// we do some stuff for library UI. let's undo those
function transformResponse(resp: InteractionResponse): TrueInteractionResponse {
    var actualType: number = 2;

    switch (resp.type) {
        case InteractionResponseType.None:
            actualType = 2;
            break;
        case InteractionResponseType.SendMessage:
            actualType = 3;
            break;
        case InteractionResponseType.SendMessage |
            InteractionResponseType.DisplaySource:
            actualType = 4;
            break;
        case InteractionResponseType.DisplaySource:
            actualType = 5;
            break;
    }

    // @ts-ignore
    return {
        ...resp,
        type: actualType,
    };
}

const handlers: {
    [id: string]: (_: InteractionRequest) => Promise<InteractionResponse>;
} = {
    '786838810297630740': async function (req) {
        return {
            type: InteractionResponseType.SendMessage,
            data: {
                content: `<:slash:782701715479724063> Did I just hear someone... OwO??? From \`${req.from}\`!`,
                flags: 64,
            },
        };
    },
};

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
    var correct = false;
    var from: string = '';

    for (const keyFrom in publicKeys) {
        if (
            verify(
                hexdecode(publicKeys[keyFrom]),
                utfencode(timestamp + body),
                hexdecode(sig),
            )
        )
            correct = true;
        from = keyFrom;
    }

    if (correct === false) {
        return new Response('Invalid signature', {
            status: 401,
        });
    }

    // todo: some sort of validation... maybe. Only trusted people can get
    // here, after all.
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

        if (req.data.id in handlers) {
            return new Response(
                JSON.stringify(
                    transformResponse(
                        await handlers[req.data.id]({
                            from: from,
                            interaction: req,
                        }),
                    ),
                ),
            );
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
