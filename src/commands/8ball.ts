import { InteractionResponseType } from 'slash-commands/dist/src/structures';
import { createOriginal, followup } from '.';

export async function handle8Ball(
    interaction: InteractionWithContext,
): Promise<void> {
    await createOriginal(interaction, {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'hihi!',
        },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await createOriginal(interaction, {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'I have responded!',
        },
    });

    await followup(interaction, {
        // TODO: make a specialized option map for every command... maybe?
        // erroring might be enough, to be honest.
        content: `Your question was \`${interaction.options.get('question')}\`, right?`,
    });
}
