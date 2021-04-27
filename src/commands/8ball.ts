import { InteractionResponseType } from '.';
import {
    createOriginal,
    followup,
    InteractionWithContext,
} from '../lib/endpoints';

export async function handle8Ball(
    interaction: InteractionWithContext,
): Promise<void> {
    await createOriginal(interaction, {
        type:
            InteractionResponseType.DisplaySource |
            InteractionResponseType.SendMessage,
        data: {
            content: 'hihi!',
        },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await createOriginal(interaction, {
        type:
            InteractionResponseType.DisplaySource |
            InteractionResponseType.SendMessage,
        data: {
            content: 'I have responded!',
        },
    });

    await followup(interaction, {
        // TODO: make a specialized option map for every command... maybe?
        // erroring might be enough, to be honest.
        content: `Your question was \`${interaction.options.question}\`, right?`,
    });
}
