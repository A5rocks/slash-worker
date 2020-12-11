import { verify } from './ed25519';

async function handlePost(request: Request): Promise<Response> {
    return new Response('testing.');
}

async function handleOwO(request: any): Promise<Response> {
    return new Response(JSON.stringify({
        type: 3,
        data: {
            'content': 'Did I just hear someone... OwO??? Nice!',
            'flags': 64  // ephemeral
        }
    }));
}

async function handleRequest(request: Request): Promise<Response> {
    if (request.method === 'POST') {
        const sig = request.headers.get('X-Signature-Ed25519');

        if (sig === null) {
            return new Response('No signature given.', {
                status: 401
            });
        }

        const timestamp = request.headers.get('X-Signature-Timestamp');

        if (timestamp == null) {
            return new Response('No timestamp given.', {
                status: 401
            });
        }

        if (parseInt(timestamp) < Date.now() / 1000 - 5) {
            return new Response('Too old timestamp.', {
                status: 401
            });
        }

        const rawBody = Buffer.from(await request.clone().text(), 'utf-8');

        const correct = await verify(sig, Buffer.concat([Buffer.from(timestamp, 'utf-8'), rawBody]),
        // @ts-ignore
        PUBLIC_KEY);
        
        if (correct === false) {
            return new Response('Invalid signature', {
                status: 401
            });
        }

        const req = await request.json();

        if (req.type === 1) {
            return new Response(JSON.stringify({
                type: 1
            }));
        } else if (req.type === 2) {
            if (req.data.id === '786838810297630740') {
                return handleOwO(req);
            } else {
                return new Response(JSON.stringify({
                    type: 4,
                    data: {
                        'content': 'Command not set up in `slash-worker`!',
                    }
                }));
            }
        } else {
            return new Response('Unknown type!');
        }
        
    } else {
        return new Response('Method Not Allowed.', {
            status: 405
        });
    }
}


addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request))
})
