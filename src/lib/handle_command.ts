import { handlers } from '..';
import { InteractionResponseType } from '../types';

export async function handleCommand(
    interaction: InteractionRequest,
): Promise<InteractionResponse> {
    const commandId = interaction.data!.id;
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
