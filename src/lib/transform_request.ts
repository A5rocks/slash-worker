import {
    ApplicationCommandInteractionDataOption,
    ApplicationCommandOptionValue,
    Interaction,
} from 'slash-commands/dist/src/structures';

// fixme: we ignore subgroups and subcommands
// maybe a way to solve: (?)
// https://discord.com/channels/110373943822540800/110373943822540800/788148728824463433
// (BrightSkyz)
function fixArguments(
    options: ApplicationCommandInteractionDataOption[],
    result: { [id: string]: ApplicationCommandOptionValue },
): { [id: string]: ApplicationCommandOptionValue } {
    if (options === undefined) {
        return result;
    }

    for (const option of options) {
        if (!('value' in option)) {
            fixArguments(option.options, result);
            continue;
        }

        result[option.name] = option.value;
    }

    return result;
}

// we want to transform the options into a mapping
export function transformRequest(
    interaction: Interaction,
    from: string,
): InteractionRequest {
    const optionsDict: { [id: string]: ApplicationCommandOptionValue } = {};
    return {
        ...interaction,
        from: from,
        options: fixArguments(
            interaction.data === undefined
                ? []
                : interaction.data.options === undefined
                ? []
                : interaction.data.options,
            optionsDict,
        ),
    };
}
