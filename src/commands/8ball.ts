import { InteractionResponseType } from '.';

export async function handle8Ball(
    interaction: InteractionRequest,
): Promise<InteractionResponse> {
    return {
        type: InteractionResponseType.SendMessage,
        data: {
            // TODO: make a specialized option map for every command... maybe?
            // erroring might be enough, to be honest.
            content: `Your question was \`${interaction.options.question}\`, right?`,
        },
    };
}
