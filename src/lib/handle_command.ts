import { InteractionType } from 'slash-commands/dist/structures';
import { handlers } from '..';
import { InteractionResponseType } from '../types';

function neverHappens(): never {
    throw new Error('Invalid state, `handle_command.ts`');
}

export async function handleCommand(
    interaction: InteractionRequest,
): Promise<InteractionResponse> {
    // todo: export ApplicationCommand from slash-worker so I do not lose type info
    if (interaction.type !== InteractionType.APPLICATION_COMMAND) return neverHappens();

    const commandId = interaction.data.id;
    if (commandId in handlers) {
        return await handlers[commandId](interaction);
    } else {
        return {
            type:
                InteractionResponseType.SendMessage |
                InteractionResponseType.DisplaySource,
            data: {
                content: 'Command not set up in `slash-worker`.',
            },
        };
    }
}
