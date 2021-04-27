// adapted from https://gist.githubusercontent.com/mhart/1b3bbfbdfa6825baab003b5f55a15322/raw/bec8f7afcacaf1f9dc4410174e4ebb65acc1b4bd/index.js

// Get the key from the "DSN" at: https://sentry.io/settings/<org>/projects/<project>/keys/
// The "DSN" will be in the form: https://<SENTRY_KEY>@<HOST>/<SENTRY_PROJECT_ID>
// eg, https://0000aaaa1111bbbb2222cccc3333dddd@sentry.io/123456
const SENTRY_PROJECT_ID = '';
const SENTRY_KEY = '';
const HOST = '';

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript#environment
const ENV = 'production';

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript#release
// A string describing the version of the release – we just use: git rev-parse --verify HEAD
// You can use this to associate files/source-maps: https://docs.sentry.io/cli/releases/#upload-files
const RELEASE = `slash-worker-${require('../package.json').version}`;

// Indicates the name of the SDK client
const CLIENT_NAME = 'slash-worker';
const CLIENT_VERSION = '1.0.0';
const RETRIES = 3;

// The log() function takes an Error object and the current request
//
// Eg, from a worker:
//
// addEventListener('fetch', event => {
//   event.respondWith(async () => {
//     try {
//       throw new Error('Oh no!')
//     } catch (e) {
//       await log(e, event.request)
//     }
//     return new Response('Logged!')
//   })
// })

export async function log(err: Error, request: InteractionRequest) {
    // @ts-ignore
    if (SENTRY_PROJECT_ID === '' || SENTRY_KEY === '' || HOST === '') return;

    if (!(err instanceof Error)) return console.error(err);

    const body = JSON.stringify(toSentryEvent(err, request));

    for (let i = 0; i <= RETRIES; i++) {
        const res = await fetch(
            `https://${HOST}/api/${SENTRY_PROJECT_ID}/store/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Sentry-Auth': [
                        'Sentry sentry_version=7',
                        `sentry_client=${CLIENT_NAME}/${CLIENT_VERSION}`,
                        `sentry_key=${SENTRY_KEY}`,
                    ].join(', '),
                },
                body,
            },
        );
        if (res.status === 200) {
            return;
        }
        // We couldn't send to Sentry, try to log the response at least
        console.error({ httpStatus: res.status, ...(await res.json()) }); // eslint-disable-line no-console
    }
}

function toSentryEvent(err: Error, request: InteractionRequest) {
    const errType = err.name || (err.constructor || {}).name;
    const frames = parse(err);
    return {
        event_id: uuidv4(),
        message: errType + ': ' + (err.message || '<no message>'),
        exception: {
            values: [
                {
                    type: errType,
                    value: err.message,
                    stacktrace: frames.length
                        ? { frames: frames.reverse() }
                        : undefined,
                },
            ],
        },
        extra: {
            // TODO: this does not seem right: upstream a fix if necessary.
            //   guild id is also not always provided, but we're fine with `undefined` here :)
            guild_id:
                'guild_id' in request ? request.guild_id : request.guildId,
            channel_id:
                'channel_id' in request
                    ? request.channel_id
                    : request.channelId,
            command_name:
                request.data === undefined ? undefined : request.data.name,
            options:
                request.data === undefined ? undefined : request.data.options,
            from: request.from,
        },
        tags: {
            command_id:
                request.data === undefined ? undefined : request.data.id,
        },
        platform: 'javascript',
        environment: ENV,
        timestamp: Date.now() / 1000,
        user:
            request.member.user === undefined
                ? undefined
                : {
                      id: request.member.user.id,
                      username: `${request.member.user.username}#${request.member.user.discriminator}`,
                  },
        release: RELEASE,
    };
}

function parse(err: Error) {
    return (err.stack || '')
        .split('\n')
        .slice(1)
        .map((line) => {
            if (line.match(/^\s*[-]{4,}$/)) {
                return { filename: line };
            }

            // From https://github.com/felixge/node-stack-trace/blob/1ec9ba43eece124526c273c917104b4226898932/lib/stack-trace.js#L42
            const lineMatch = line.match(
                /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/,
            );
            if (!lineMatch) {
                return;
            }

            return {
                function: lineMatch[1] || undefined,
                filename: lineMatch[2] || undefined,
                lineno: +lineMatch[3] || undefined,
                colno: +lineMatch[4] || undefined,
                in_app: lineMatch[5] !== 'native' || undefined,
            };
        })
        .filter(Boolean);
}

function uuidv4() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [...bytes].map((b) => ('0' + b.toString(16)).slice(-2)).join(''); // to hex
}
