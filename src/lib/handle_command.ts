import {
    InteractionResponseType,
    InteractionType,
} from 'slash-commands/dist/src/structures';
import { handlers } from '..';
import { createOriginal } from './endpoints';

function neverHappens(): never {
    throw new Error('Invalid state, `handle_command.ts`');
}

export async function handleCommand(
    interaction: InteractionRequest,
    event: FetchEvent,
): Promise<InteractionResponse> {
    // todo: export ApplicationCommand from slash-worker so I do not lose type info
    if (interaction.type !== InteractionType.APPLICATION_COMMAND)
        return neverHappens();

    const commandId = interaction.data.id;
    if (commandId in handlers) {
        const command = handlers[commandId];

        const resp: Promise<InteractionResponse> = new Promise((resolve) => {
            const context: InteractionWithContext = {
                ...interaction,
                context: {
                    originalResp: resolve,
                    haveResponded: false,
                },
            };

            setTimeout(() => {
                if (!context.context.haveResponded) {
                    context.context.haveResponded = true;
                    resolve({
                        type:
                            InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    });
                }
            }, 2500);

            event.waitUntil(
                (async () => {
                    const res = await command(context);

                    if (res && !context.context.haveResponded) {
                        await createOriginal(context, res);
                    } else if (res) {
                        // this is safe because commands that return values cannot
                        //  call any endpoints (as they don't have a context on
                        //  them... well they do but not according to types).
                        await createOriginal(context, res);
                    }
                })(),
            );
        });

        return await resp;
    } else {
        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Command not set up in `slash-worker`.',
            },
        };
    }
}
